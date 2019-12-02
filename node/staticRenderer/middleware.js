import mime from 'mime'
import path from 'path'

import gracefulError from './gracefulError'

export default function middleware ({
	render,
	pagelist
}) {
	let livereload
	const entries = {}

	staticMiddleware.setLiveReloader = function setLiveReloader (fn) {
		if (!livereload) watchChanges()
		livereload = fn
	}

	return staticMiddleware

	function staticMiddleware (req, res, next) {
		const page = pagelist.getPageFromRoute(req.url)

		// If the current requested url match an existing route
		if (page) processTemplate(page, { req, res, next })
		// It's not for this middleware, skip this request
		else next()
	}

	function watchChanges () {
		// TODO: livereload watching templates changes
	}

	async function processTemplate (page, { res }) {
		try {
			const rendered = await render(page)
			const extension = path.extname(page.destination)
			const contentType = mime.getType(extension)
			res.setHeader('Content-Type', contentType)
			res.end(rendered)
		} catch (err) {
			gracefulError(res, err, entries)
		}
	}
}
