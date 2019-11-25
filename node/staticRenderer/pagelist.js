import path from 'path'
import { pathToRegexp, compile } from 'path-to-regexp'

import deepAssign from '../utils/deepAssign'

const TEMPLATE_EXTENSION = '.njk'
const noopStr = v => v || ''

export default function pagelist (opts = {}) {
	const config = opts.config
	const baseURL = config.baseURL
	const views = new Map()
	const pages = new Set()
	const pagesPerUrl = new Map()

	const getLocaleUrl = opts.routes.locale
		? compile(opts.routes.locale)
		: noopStr

	const localeKeys = new Set()
	const lk = []
	opts.routes.locale && pathToRegexp(opts.routes.locale, lk)
	lk.forEach(v => localeKeys.add(v.name))

	init()

	return {
		getPageFromRoute,
		getAll: () => pages
	}

	function init () {
		const locale = opts.routes.locale

		// Prepare views, precompute regexps
		opts.routes.views.forEach(v => {
			const view = deepAssign({}, v)
			let fullExp = []
			view.localized = !view.expression.startsWith('/')

			if (view.localized) { fullExp = fullExp.concat(locale.split('/')) }

			fullExp = fullExp
				.concat(view.expression.split('/'))
				.filter(v => v.length > 0)

			fullExp = '/' + fullExp.join('/')

			view.getPath = compile(fullExp)
			view.template = path.join(
				config.paths.templates,
				view.template + TEMPLATE_EXTENSION
			)
			views.set(view.id, view)
		})

		// Prepare pages, precompute urls
		opts.pages.forEach(p => {
			const page = deepAssign({}, p)
			const view = page.view && views.get(page.view)

			// View is defined for the page but not in routes
			// it can be a env-specific view
			// skip it
			if (page.view && !view) {
				return
			}

			if (view) {
				// Do not render silent views
				const isSilent = view.options && view.options.silent
				if (isSilent) return

				page.locale = buildLocalObject(page)
				page.needsJSRendering = true
				page.template = view.template
				page.url = page.destination = view
					.getPath(Object.assign(
						page.locale,
						page.params
					))
			} else if (page.destination) {
				page.locale = buildLocalObject(page)
				if (Object.keys(page.locale).length < localeKeys.size) page.locale = null

				if (page.template) {
					page.template = path.join(
						config.paths.templates,
						page.template + TEMPLATE_EXTENSION
					)
				}

				page.destination = getPath(
					page.locale,
					page.destination
				)
			} else {
				return
			}

			page.destination = normalize(page.destination, true)
			pages.add(page)
			pagesPerUrl.set(page.destination, page)
		})
	}

	function buildLocalObject (obj) {
		const locale = {}
		Object.keys(obj)
			.forEach(k => {
				if (!localeKeys.has(k)) return
				locale[k] = obj[k]
			})
		return locale
	}

	// Get path for urls without attached view
	function getPath (locale, filepath) {
		let fullExp = []

		if (locale) { fullExp = fullExp.concat(getLocaleUrl(locale).split('/')) }

		fullExp = fullExp.concat(filepath.split('/'))

		return '/' + fullExp
			.filter(v => v.length > 0)
			.join('/')
	}

	// Normalize route - append index.html to / if needed
	function normalize (reqRoute, noStrip) {
		let route = new URL(reqRoute, 'http://localhost/').pathname
		const endsSlash = route.slice(-1) === '/'
		const hasExt = path.extname(route).length > 0
		if (!hasExt && endsSlash) route += 'index.html'
		else if (!hasExt) route += '/index.html'

		// Strip base url from requested url
		route = noStrip
			? route.slice(1)
			: route.replace(new RegExp('^' + baseURL), '')

		return route
	}

	// get page data from requested route
	function getPageFromRoute (route) {
		const data = pagesPerUrl.get(normalize(route))
		return data
	}
}
