const supportPageOffset = window.pageYOffset !== undefined

export default function pinnable ({ picture, fonts, controller }) {
	let width = 0
	let height = 0
	let scrollY = 0

	window.addEventListener('scroll', onScroll)
	window.addEventListener('resize', onResize)
	onScroll()
	onResize()

	window.setTimeout(() => onResize(), 1)
	window.setTimeout(() => onResize(), 100)
	window.setTimeout(() => onResize(), 500)

	function checkPinnable () {
		// 0.0385 should be 0.04, but there is a weird offset for percent margins
		const fontsOffset = picture.clientHeight + width * 0.0385 + fonts.clientHeight - scrollY
		const isFontsPinnable = (picture.clientHeight + width * 0.02 - scrollY) < 0
		const isResizerPinnable = (height - fontsOffset - width * 0.02 - 40 - controller.clientHeight) > 0
		const isHeightGood = (height - controller.clientHeight - fonts.clientHeight - width * 0.04 > 0)

		if (window.innerWidth > 700 && isFontsPinnable && isHeightGood) {
			if (!fonts.classList.contains('pinned')) {
				fonts.classList.add('pinned')
			}
		} else {
			if (fonts.classList.contains('pinned')) {
				fonts.classList.remove('pinned')
			}
		}

		if (window.innerWidth > 700 && isResizerPinnable && isHeightGood) {
			if (!controller.classList.contains('pinned')) {
				controller.classList.add('pinned')
			}
		} else {
			if (controller.classList.contains('pinned')) {
				controller.classList.remove('pinned')
			}
		}
	}

	function onScroll () {
		scrollY = supportPageOffset
			? window.pageYOffset
			: document.documentElement.scrollTop
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
}
