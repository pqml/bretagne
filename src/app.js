import fontSize from './components/fontSize'
import sound from './components/sound'
import router from './components/router'

const q = s => document.querySelector(s)
const qa = s => Array.from(document.querySelectorAll(s))

const els = {
	body: q('body'),
	visualizer: q('.visualizer'),
	increase: q('.resizer-button.button-increase'),
	decrease: q('.resizer-button.button-decrease'),
	resizerValue: q('.resizer-value'),
	soundButton: q('.sound-button'),
	links: qa('[data-route]')
}

fontSize(els)
sound(els)
router(els)
