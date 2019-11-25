export default async function createPages ({ config }) {
	const pages = []
	pages.push({
		destination: 'index.html',
		template: 'default',
		content: {}
	})
	return pages
}
