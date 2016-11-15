import page from 'page'
const supportPageOffset = window.pageYOffset !== undefined

const dom = {
  picture: document.getElementById('picture'),
  fonts: document.getElementById('fonts'),
  fontItems: document.getElementsByClassName('font'),
  visualizer: document.getElementById('visualizer-font'),
  resizer: document.getElementById('resizer'),
  decrease: document.getElementById('resizer-decrease'),
  increase: document.getElementById('resizer-increase'),
  currentSize: document.getElementById('resizer-currentsize')
}
dom.parentVisualizer = dom.visualizer.parentNode

const { publicPath, fonts, defaultSlug } = window.bretagne
const sizes = [6, 8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 84, 92]
const isSafari = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) 

let currentSizeIndex = 11
let height, width
let scrollY = 0
let cachedSlugs = []

function cap (text) {
  return text.replace(/\b\w/g, l => l.toUpperCase())
}

function stripSpan (e) {
  if (!e.target.tagName) return
  if (e.target.tagName.toLowerCase() === 'span') {
    e.target.removeAttribute('style')
  }
}

function repaint () {
  if (!isSafari) return 
  dom.parentVisualizer.style.background = 'white'
  dom.parentVisualizer.offsetHeight
  dom.parentVisualizer.style.background = 'transparent'
}

function switchFont (slug) {
  if (!fonts[slug]) return
  const newChunks = fonts[slug][2]

  // join all chunks for fontFamily property
  const familyChunks = newChunks.join('\', \'')

  // if this is first execution, we remove server-rendered links
  if (cachedSlugs.length === 0) {
    let styleChunks = document.getElementsByClassName('fontChunk')
    for (let i = 0; i < styleChunks.length; i++) {
      styleChunks[i].parentNode.removeChild(styleChunks[i])
    }
  }

  // if new slug is not cached, load all chunks stylesheets
  if (cachedSlugs.indexOf(slug) === -1) {
    for (let i = 0; i < newChunks.length; i++) {
      let link = document.createElement('link')
      link.href = `fonts/${newChunks}.css`
      link.rel = 'stylesheet'
      link.classList.add('fontChunk')
      document.getElementsByTagName('head')[0].appendChild(link)
    }
    cachedSlugs.push(slug)
  }

  // update fontFamily of the visualizer
  dom.visualizer.style.fontFamily = `'${familyChunks}', sans-serif`
  repaint()
}

function checkPinnable () {
  // 0.0385 should be 0.04, but there is a weird offset for percent margins
  const fontsOffset = dom.picture.clientHeight + width * 0.0385 + dom.fonts.clientHeight - scrollY
  const isFontsPinnable = (dom.picture.clientHeight + width * 0.02 - scrollY) < 0
  const isResizerPinnable = (height - fontsOffset - width * 0.02 - 20 - dom.resizer.clientHeight) > 0
  const isHeightGood = (height - dom.resizer.clientHeight - dom.fonts.clientHeight - width * 0.04 > 0)

  if (window.innerWidth > 700 && isFontsPinnable && isHeightGood) {
    if (!dom.fonts.classList.contains('pinned')) {
      dom.fonts.classList.add('pinned')
    }
  } else {
    if (dom.fonts.classList.contains('pinned')) {
      dom.fonts.classList.remove('pinned')
    }
  }

  if (window.innerWidth > 700 && isResizerPinnable && isHeightGood) {
    if (!dom.resizer.classList.contains('pinned')) {
      dom.resizer.classList.add('pinned')
    }
  } else {
    if (dom.resizer.classList.contains('pinned')) {
      dom.resizer.classList.remove('pinned')
    }
  }
}

function onScroll () {
  scrollY = supportPageOffset ? window.pageYOffset : document.documentElement.scrollTop
  checkPinnable()
}

function onResize () {
  width = window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth

  height = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight

  checkPinnable()
}

function updateSize (newSize) {
  dom.currentSize.textContent = ('0' + newSize).slice(-2) + 'pt'
  dom.visualizer.style.fontSize = newSize + 'px'
  repaint()
}

function changePage (ctx, next) {
  const isIndex = !ctx.params.font
  const slug = ctx.params.font || defaultSlug

  const font = fonts[slug]
  if (!font) return

  document.title = isIndex
    ? `Bretagne`
    : `Bretagne — ${cap(font[0])} ${cap(font[1])}`

  for (let i = 0; i < dom.fontItems.length; i++) {
    const url = dom.fontItems[i].href.split('/')
    const compSlug = url[url.length - 1]
    if (slug === compSlug) {
      // do nothing if this is the current page
      if (!dom.fontItems[i].classList.contains('link--current')) {
        dom.fontItems[i].classList.add('link--current')
      } else {
        return
      }
    } else {
      dom.fontItems[i].classList.remove('link--current')
    }
  }

  switchFont(slug)
}

dom.decrease.addEventListener('click', (evt) => {
  if (currentSizeIndex > 0) currentSizeIndex--
  updateSize(sizes[currentSizeIndex])
})

dom.increase.addEventListener('click', (evt) => {
  if (currentSizeIndex < (sizes.length - 1)) currentSizeIndex++
  updateSize(sizes[currentSizeIndex])
})

window.addEventListener('scroll', onScroll)
window.addEventListener('resize', onResize)
if (isSafari) dom.visualizer.addEventListener('keydown', repaint)
dom.visualizer.addEventListener('DOMNodeInserted', stripSpan)

document.addEventListener('DOMContentLoaded', () => {
  // fix to disable spellcheck
  dom.visualizer.spellcheck = false
  dom.visualizer.focus()
  dom.visualizer.blur()
  dom.resizer.classList.remove('hidden')
  onResize()
  onScroll()
})

page.base(publicPath)
page('/', changePage)
page('font/:font', changePage)
page()
