import slugify from 'slugify'

const fontCss = (url) => (`
@font-face {
	font-family: "${url}";
	src: url("${url}.eot");
	src: url("${url}.eot?#iefix") format("embedded-opentype"),
		 url("${url}.woff2") format("woff2"),
		 url("${url}.woff") format("woff"),
		 url("${url}.ttf") format("ttf"),
		 url("${url}.svg#${url}") format("svg");
	font-style: normal;
	font-weight: 300;
}
`).trim()

export function appendFontCSS (data) {
	data.forEach(family => {
		family.fonts.forEach(font => {
			font.css = fontCss(font.url)
		})
	})
}

export function fontList (cb) {
	const data = []
	cb(family)
	return data

	function family (name) {
		const family = { name, description: '', fonts: [] }
		const api = { font, description }
		data.push(family)
		return api

		function description (desc) {
			family.description = desc
			return api
		}

		function font (name, url, opts = {}) {
			name = name.trim()
			url = url.trim()
			const slug = slugify(family.name.toLowerCase() + '-' + name.toLowerCase())
			family.fonts.push({ name, url, slug })
			return api
		}
	}
}
