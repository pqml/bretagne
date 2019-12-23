import fontSize from './components/fontSize'
import sound from './components/sound'
import router from './components/router'
import visualizer from './components/visualizer'
import pinnable from './components/pinnable'
import matomo from './components/matomo'

const q = s => document.querySelector(s)
const qa = s => Array.from(document.querySelectorAll(s))
const analytics = matomo()

const els = {
	body: q('body'),
	visualizer: q('.visualizer'),
	increase: q('.resizer-button.button-increase'),
	decrease: q('.resizer-button.button-decrease'),
	resizerValue: q('.resizer-value'),
	soundButton: q('.sound-button'),
	links: qa('[data-route]'),

	fonts: q('.menu-fonts'),
	picture: q('.header-picture'),
	controller: q('.menu-controller'),

	analytics
}

analytics.load()
pinnable(els)
fontSize(els)
sound(els)
router(els)
visualizer(els)
