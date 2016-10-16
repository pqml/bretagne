var DOM = {
  main: document.getElementsByTagName('main')[0],
  image: document.getElementsByClassName('previewimg')[0],
  wrapper: document.getElementsByClassName('soon')[0],
  texts: document.getElementsByClassName('soon-txt')
}

var iTextH, iTextW, iFontSize

function initSizes () {
  iTextH = DOM.texts[0].clientHeight
  iTextW = DOM.texts[0].clientWidth
  iFontSize = 17
}

function resizeText (size) {
  for (var i = 0; i < DOM.texts.length; i++) {
    DOM.texts[i].style.fontSize = size + 'px'
  }
}

function isFluid () {
  var ratio = window.innerHeight / window.innerWidth
  if (ratio > 1.5) {
    DOM.main.classList.remove('fluid')
    DOM.main.classList.add('mobile')
    return false
  } else {
    DOM.main.classList.add('fluid')
    DOM.main.classList.remove('mobile')
    return true
  }
}

function fitText () {
  if (!isFluid()) return
  if (!iTextH) initSizes()
  var nEmptyH = DOM.image.clientHeight
  var nEmptyW = window.innerWidth - DOM.image.clientWidth
  resizeText(Math.min((nEmptyW * iFontSize) / iTextW, (iFontSize * nEmptyH) / iTextH))
}

window.addEventListener('resize', fitText)

window.WebFont.load({
  custom: {
    families: ['SelfModern-Light']
  },
  loading: function () {
    setTimeout(function () {
      if (isFluid()) {
        initSizes()
        fitText()
      }
    }, 10)
  }
})
