const fs = require('fs-extra')
const sh = require('kool-shell')
const path = require('path')
const slug = require('slug')

const fontfacegen = require('fontfacegen')

const brostart = require('../config/brostart.config.js')
const bretagneConfig = require('../config/bretagne.config.js')
const paths = require('../config/paths.config.js')
const fontPath = path.join(paths.src, 'fonts')
const fontRouteRoot = path.join(paths.content, 'font')
const fontDist = path.join(paths.static, 'fonts')

const util = require('util')
const loadFiles = require('./utils/loadFiles.js')
const yamlManager = require('./utils/yaml.js')
const yaml = yamlManager(path.join(paths.content, 'font'), brostart.templating.yamlSafeLoad)

let fonts = {}
let fontsToUpdate = []
let fontsToCreate = []

const force = (process.argv[2] === '--reset')

function subShuffle (str) {
  let a = str.split('')
  const n = a.length
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }
  return a.join('')
}

function chunkSubset (str, count) {
  const length = Math.ceil(str.length / count)
  return str.match(new RegExp('.{1,' + length + '}', 'g'))
}

const subsetChunks = chunkSubset(subShuffle(bretagneConfig.subset), 1)

function rebuildFolder (folderPath) {
  return new Promise((resolve, reject) => {
    fs.remove(folderPath, (err) => {
      if (err) return reject()
      fs.mkdirs(folderPath, (err) => err ? reject(err) : resolve())
    })
  })
}

function resetFonts () {
  sh.info('\nRemoving all fonts...\nRebuilding static fonts & fonts content folders')
  fonts = {}
  let p = []
  p.push(rebuildFolder(fontRouteRoot))
  p.push(rebuildFolder(fontDist))
  return Promise.all(p)
}

function compileNavigation () {
  let families = []
  let weights = bretagneConfig.weights
  const importantFamilies = bretagneConfig.importantFamilies.map(e => e.toLowerCase())

  function sortFont (font) {
    const fam = font.family.toLowerCase()
    const sub = font.subfamily.toLowerCase()
    const importantIndex = importantFamilies.indexOf(fam)
    // search for existing family or create it
    let index
    let famSorted = false
    const newFam = { name: fam, subfamilies: [] }
    for (let i = 0; i < families.length; i++) {
      if (fam === families[i].name) {
        famSorted = true
        index = i
        break
      } else if (fam < families[i].name &&
        importantIndex < importantFamilies.indexOf(families[i].name)) {
        famSorted = true
        index = i
        families.splice(index, 0, newFam)
        break
      }
    }
    if (!famSorted) index = families.push(newFam) - 1
    let family = families[index]
    // exit if this subfamily already exist
    if (family.subfamilies.indexOf(sub) !== -1) return
    // sort the new subfamily
    let subSorted = false
    const newSub = { name: sub, slug: font.slug, chunks: font.chunks }
    if (weights.indexOf(sub) !== -1) {
      for (let i = 0; i < family.subfamilies.length; i++) {
        if (weights.indexOf(family.subfamilies[i].name) === -1) continue
        if (weights.indexOf(sub) < weights.indexOf(family.subfamilies[i].name)) {
          subSorted = true
          family.subfamilies.splice(i, 0, newSub)
          break
        }
      }
    }
    if (!subSorted) family.subfamilies.push(newSub)
  }

  for (let k in fonts) sortFont(fonts[k])
  fontsToCreate.forEach((font) => sortFont(font))

  let impFamiliesOut = []
  importantFamilies.forEach((impFamily) => {
    for (var i = families.length - 1; i >= 0; i--) {
      if (families[i].name === impFamily) {
        impFamiliesOut.push(families[i])
        families.splice(i, 1)
        break
      }
    }
  })
  families = impFamiliesOut.concat(families)

  const fontsJson = JSON.stringify(families, null, 2)

  return new Promise((resolve, reject) => {
    fs.outputFile(path.join(paths.content, 'fonts.json'), fontsJson, err => err ? reject() : resolve())
  })
}

function compileIndex () {
  let defaultFont
  for (let k in fonts) {
    if (fonts[k].slug === bretagneConfig.defaultSlug) {
      defaultFont = fonts[k]
      break
    }
  }
  if (!defaultFont) defaultFont = fonts[Object.keys(fonts)[0]] || fontsToCreate[0]
  return createYaml(path.join(paths.content, 'index.yml'), defaultFont, true)
}

function loadFontContents () {
  return new Promise((resolve, reject) => {
    yaml.loadAll()
      .then((res) => {
        for (let k in res) {
          const font = res[k]
          fonts[font.data.chunks[0]] = font.data
        }
        resolve()
      })
      .catch(reject)
  })
}

function fetchFontsFolder () {
  return loadFiles(fontPath,
    f => path.extname(f) === '.otf',
    (filePath, stats) => {
      // !!!!!!! TODO gestion des chunks

      const relPath = path.relative(fontPath, filePath)
      const newFont = {
        path: relPath,
        chunks: [],
        mtime: util.inspect(stats.mtime)
      }
      let chunksLetters = 'ABCDEFGHIJKLMNOPQSRTUVWXYZ'.split('')
      for (let i = 0; i < subsetChunks.length; i++) {
        newFont.chunks.push(relPath.slice(0, -4) + '-' + chunksLetters[i])
      }
      const k = newFont.chunks[0]

      // font doesn't exist, we need to create it
      if (!fonts[k]) {
        fontsToCreate.push(newFont)
      } else {
        // we check if font is the same file
        return new Promise((resolve, reject) => {
          const filePath = path.join(fontDist, newFont.chunks[0] + '.woff')
          fs.stat(filePath, (err, stats) => {
            if (err) {
              fontsToUpdate.push(fonts[k])
              return resolve()
            }
            const lastmTime = util.inspect(stats.mtime)
            if (newFont.mtime !== lastmTime) fontsToUpdate.push(fonts[k])
            resolve()
          })
        })
      }
      return Promise.resolve()
    })
}

function sortNewFonts () {
  return Promise.resolve()
  // TODO chunk sorting
  // fontsToCreate = fontsToCreate.sort((a, b) =>
  //   a.chunks[0].toLowerCase() < b.chunks[0].toLowerCase() ? -1 : 1)
  // return Promise.resolve()
}

function generateFont (font) {
  return new Promise((resolve, reject) => {
    let globs = font.chunks.map((el) => {
      return path.join(fontPath, el + '.otf')
    })
    // new Fontmin()
    //   .src(globs)
    //   .dest(fontDist)
    //   .use(Fontmin.glyph({
    //     text: 'ABCabc',
    //     hinting: false
    //   }))
    //   .use(Fontmin.otf2ttf())
    //   .use(Fontmin.ttf2eot())
    //   .use(Fontmin.ttf2woff())
    //   .use(Fontmin.ttf2svg())
    //   .use(Fontmin.css({
    //     fontPath: './',
    //     base64: false,
    //     fontFamily: font.slug
    //   }))
    //   .run(err => err ? reject(err) : resolve())
    try {
      const trueName = globs[0].slice(0, -6) + '.otf'
      for (let i = 0; i < globs.length; i++) {
        const pglob = (i > 0) ? globs[i - 1] : trueName
        fs.renameSync(pglob, globs[i])
        fontfacegen({
          source: globs[i],
          dest: fontDist,
          subset: subsetChunks[i]
        })
        const chunk = globs[i].split('/').pop().slice(0, -4)
        const cssPath = path.join(fontDist, chunk + '.css')
        fs.outputFileSync(cssPath, (
`@font-face {
    font-family: "${chunk}";
    src: url("${chunk}.eot");
    src: url("${chunk}.eot?#iefix") format("embedded-opentype"),
         url("${chunk}.woff2") format("woff2"),
         url("${chunk}.woff") format("woff"),
         url("${chunk}.ttf") format("ttf"),
         url("${chunk}.svg#${chunk}") format("svg");
    font-style: normal;
    font-weight: 300;
}`))
      }
      fs.renameSync(globs[globs.length - 1], trueName)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

function createYaml (filePath, font, index = false) {
  return new Promise((resolve, reject) => {
    let chunks = ''
    if (!font) resolve() // DIRTY FIX
    font.chunks.forEach((url) => {
      chunks += `  - ${url}\n`
    })
    const route = (index) ? '\nmetas:\n  title: Bretagne' : `route: font/${font.slug}/index.html\n`
    const yaml = (
`layout: font.hbs
${route}
family: ${font.family}
subfamily: ${font.subfamily}
slug: ${font.slug}
chunks:
${chunks}`)

    fs.outputFile(filePath, yaml, err => err ? reject() : resolve())
  })
}

function processNewFont (font) {
  return new Promise((resolve, reject) => {
    sh.info('\n[BzhBuilder] New font file found:', sh.colors.white(font.path))
    // TODO add to existing family
    sh.question(sh.colors.gray(`[BzhBuilder] ${font.path} > What's the family name ? (Untitled) `))
      .then((fam) => { font.family = fam !== '' ? fam : 'Untitled' })
      .then(() => sh.question(sh.colors.gray(`[BzhBuilder] ${font.path} > What's the subfamily ? (Regular) `)))
      .then((sub) => {
        font.subfamily = sub !== '' ? sub : 'Regular'
        font.slug = slug((font.family + '-' + font.subfamily).toLowerCase())
      })
      .then(() => {
        createYaml(path.join(fontRouteRoot, font.slug + '.yml'), font)
      })
      .then(() => { generateFont(font) })
      .then(() => { resolve() })
      .catch(reject)
  })
}

function updateFonts () {
  let p = []
  if (fontsToUpdate.length === 0) sh.info('\n[BzhBuilder] No font to update.')
  fontsToUpdate.forEach((font) => {
    sh.info('\n[BzhBuilder] Font seems modified: re-generating', sh.colors.white(font.slug))
    p.push(generateFont(font))
  })
  return Promise.all(p)
}

function createNewFonts () {
  if (fontsToCreate.length === 0) sh.info('\n[BzhBuilder] No new font to create.')
  return new Promise((resolve, reject) => {
    let i = 0
    if (fontsToCreate.length > 0) iterate()
    else resolve()
    function iterate () {
      processNewFont(fontsToCreate[i++])
        .then(() => {
          sh.log(`[BzhBuilder] ✔︎  ${fontsToCreate[i - 1].slug} created successfully`)
          i < fontsToCreate.length ? iterate() : resolve()
        })
        .catch(reject)
    }
  })
}

loadFontContents()
  .then(() => force ? resetFonts() : Promise.resolve())
  .then(fetchFontsFolder)
  .then(updateFonts)
  .then(sortNewFonts)
  .then(createNewFonts)
  .then(compileIndex)
  .then(() => { sh.info('\n[BzhBuilder] index.html created') })
  .then(compileNavigation)
  .then(() => { sh.info('[BzhBuilder] fonts.json created') })
  .then(() => {
    if (fontsToCreate.length === 0 && fontsToUpdate.length === 0) {
      sh.success('\n[BzhBuilder] All your fonts are already up-to-date.')
    } else {
      sh.success('\n[BzhBuilder] ★  All fonts & files are now up-to-date ★')
        .success('[BzhBuilder] Customize your content via ' + path.join(paths.content, 'font'))
    }
  })
  .catch((err) => {
    sh.error('\n[BzhBuilder] ✖︎ Something went wrong... ✖︎')
      .error(err)
  })
