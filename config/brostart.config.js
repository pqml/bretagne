const bretagneConfig = require('./bretagne.config.js')
let families
try {
  families = require('../src/content/fonts.json')
} catch (err) {
  families = []
}
let fonts = {}
families.forEach((family) => {
  family.subfamilies.forEach((font) => {
    fonts[font.slug] = [family.name, font.name, font.chunks]
  })
})
fonts = JSON.stringify(fonts)

function capitalize (text) {
  return text.replace(/(?:^|\s)\S/g, l => l.toUpperCase())
}

const broStartConfig = {
  devServer: {
    historyAPIFallback: true,
    port: 8080,
    tunnel: true,
    xip: false,
    offline: false
  },
  templating: {
    yamlSafeLoad: false,
    autoPartials: true
  },
  lifecycle: {
    onHandlebarsInit (handlebars) {
      // add your own custom helpers, partials, decorators here
      handlebars.registerHelper('nl2br', (text) => {
        const reg = /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g
        const nl2brStr = (text + '').replace(reg, '$1' + '<br>' + '$2')
        return new handlebars.SafeString(nl2brStr)
      })
      handlebars.registerHelper('capitalize', capitalize)
      handlebars.registerHelper('links', (family, currentSlug) => {
        let output = ''
        if (family.subfamilies.length > 1) {
          let famslug = family.subfamilies[0].slug
          output += `<a href="font/${famslug}">${capitalize(family.name)}</a>,<br>`
          for (let i = 0; i < family.subfamilies.length; i++) {
            const sub = family.subfamilies[i]
            const current = currentSlug === sub.slug ? 'link--current ' : ''
            const classes = `class="${current}font"`
            output += `<a href="font/${sub.slug}" ${classes}>${sub.name}</a>`
            if (family.subfamilies[i + 1]) output += ' & '
          }
        } else {
          let sub = family.subfamilies[0]
          const current = currentSlug === sub.slug ? 'link--current ' : ''
          const classes = `class="${current}font"`
          output += `<a href="font/${sub.slug}" ${classes}>${capitalize(family.name)}</a>`
        }
        return output
      })
    },
    beforeHandlebarsRender (data) {
      // you can mutate data if you need to add/remove content before rendering
      data.text = bretagneConfig.text
      data.families = families
      data.fonts = fonts
      data.defaultSlug = bretagneConfig.defaultSlug
      data.metas = data.metas || {}
      data.metas.title = (data.metas.title)
        ? bretagneConfig.title
        : bretagneConfig.title + ' — ' + capitalize(data.family) + ' ' + capitalize(data.subfamily)
      data.metas.description = bretagneConfig.description
    }
  }
}

module.exports = broStartConfig
