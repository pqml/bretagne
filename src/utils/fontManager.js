import slugify from 'slugify'

export function getFontCss (font) {
	return [
		`@font-face { `,
		`font-family: "${font.slug}"; `,
		`src: url("fonts/${font.url}.eot"); `,
		`src: url("fonts/${font.url}.eot?#iefix") format("embedded-opentype"), `,
		`url("fonts/${font.url}.woff2") format("woff2"), `,
		`url("fonts/${font.url}.woff") format("woff"), `,
		`url("fonts/${font.url}.ttf") format("ttf"), `,
		`url("fonts/${font.url}.svg#fonts/${font.url}") format("svg"); `,
		`font-style: normal; `,
		`font-weight: 300; `,
		`} `
	].join('')
}

export function fontList (cb) {
	const data = []
	cb(family)
	return data

	function family (name) {
		const family = { name: name.trim(), description: '', fonts: [] }
		const api = { font, description }
		data.push(family)
		return api

		function description (desc) {
			family.description = desc.trim()
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
