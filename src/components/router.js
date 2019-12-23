const noop = () => {}
const capitalize = s => {
	return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function router ({ fonts, links, body, visualizer, analytics }) {
	const w = window
	const orig = document.location.origin
	const base = new URL(document.querySelector('base').href, orig).pathname
	const history = w.history
	let referrer = document.referrer === document.URL
		? undefined
		: document.referrer

	const fontList = FONTS
		.map(family => family.fonts)
		.reduce((p, v) => p.concat(v), [])

	fontList.forEach(font => {
		const fel = fonts.querySelector('[data-family="' + font.family + '"]')
		const el = fonts.querySelector('[data-slug="' + font.slug + '"]')
		font.fontEl = el
		font.familyEl = fel
	})

	let prev = null

	navigate(document.location.href)

	w.addEventListener('popstate', e => {
		if (!e.state || e.state.url === undefined) return
		navigate(e.state.url, true)
	})

	links.forEach(el => (el.onclick = e => {
		if (e.metaKey || e.ctrlKey || e.shiftKey) return
		e.preventDefault()
		navigate(el.href)
	}))

	function repaint () {
		visualizer.parentNode.style.background = 'white'
		noop(visualizer.parentNode.offsetHeight)
		visualizer.parentNode.style.background = 'transparent'
	}

	function normalize (rawUrl, replace) {
		let url = new URL(rawUrl, orig).pathname
		if (url.startsWith(base)) url = url.slice(base.length)
		return url
	}

	function navigate (rawUrl, replace) {
		const url = normalize(rawUrl)
		if (url === prev) return
		const parts = url.split('/').filter(v => v.length)
		if (!parts.length) update(rawUrl, home, replace)
		else if (parts[0] === 'font') update(rawUrl, font, replace, parts[1])
	}

	function update (rawUrl, cb, replace, arg) {
		const url = normalize(rawUrl)
		const method = !replace && prev !== null ? 'pushState' : 'replaceState'
		history[method]({ url: rawUrl }, '', base + url)

		prev = url

		cb(arg)
		repaint()

		const titlePart = document.title.split('–')[1]
		const title = titlePart ? 'Font – ' + titlePart.trim() : 'Home'
		analytics.pageView({
			title,
			url: base + url,
			referrer
		})

		referrer = base + url
	}

	function home () {
		body.classList.add('home')
		updateFontMenu()
	}

	function font (slug) {
		body.classList.remove('home')
		visualizer.style.fontFamily = slug
		updateFontMenu(slug)
	}

	function updateFontMenu (slug) {
		const items = Array.from(fonts.querySelectorAll('.active'))
		items.forEach(v => v.classList.remove('active'))

		let font = null
		if (slug) {
			for (let i = 0, l = fontList.length; i < l; i++) {
				if (fontList[i].slug !== slug) continue
				font = fontList[i]
				break
			}
		}

		const metaTitle = document.title.split('–')[0].trim()
		document.title = metaTitle + (font ? ' – ' + font.family + ' ' + capitalize(font.name) : '')

		if (!font) return

		font.familyEl && font.familyEl.classList.add('active')
		font.fontEl && font.fontEl.classList.add('active')
	}
}
