export default async function createPages ({ config }) {
	const pages = []

	pages.push({
		destination: 'index.html',
		template: 'default',
		content: Object.assign({ isHome: true }, config.content)
	})

	config.fonts.forEach(family => {
		family.fonts.forEach(font => {
			pages.push({
				destination: `font/${font.slug}/index.html`,
				template: 'default',
				content: Object.assign({}, config.content, { font })
			})
		})
	})

	return pages
}
