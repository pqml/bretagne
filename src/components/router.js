export default function router ({ links, body, visualizer }) {
	const w = window
	const orig = document.location.origin
	const base = new URL(document.querySelector('base').href, orig).pathname
	const history = w.history
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
	}

	function home () {
		body.classList.add('home')
	}

	function font (slug) {
		body.classList.remove('home')
		visualizer.style.fontFamily = slug
	}
}
