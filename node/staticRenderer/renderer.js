// import { promisify } from 'util';
import path from 'path'
import fs from 'fs-extra'
import nunjucks from 'nunjucks'
import { minify } from 'html-minifier'

// import { error } from '../utils/logger'
import deepAssign from '../utils/deepAssign'

// import jsdomRender from './jsdom-render'
import appendLoadJS from './appendLoadJS'

export default function renderer ({ config, pagelist }) {
	// Init data from config
	const data = deepAssign({}, config)
	nunjucks.configure(config.paths.templates, {
		autoescape: false,
		noCache: config.devServerBuild
	})

	return { launch, render, renderAll, setEntries }

	async function launch () {
		await appendLoadJS(data)
		setEntries()
	}

	function setEntries (entries = { css: [], js: [] }) {
		data.entries = entries
	}

	// TODO: cache and invalidate cache
	async function loadTemplate (url) {
		const template = await fs.readFile(url, 'utf-8')
		return template
	}

	// Compile all data
	function getData (page) {
		const pageData = {}
		pageData.tags = {}
		pageData.locale = page.locale || {}

		const content = {
			oscar: data,
			page: pageData,
			content: page.content
		}

		return content
	}

	async function render (page) {
		// console.log( page );

		const str = await loadTemplate(page.template)
		const content = getData(page)
		const output = nunjucks.renderString(str, content)

		// if (page.needsJSRendering) {
		// 	const before = output
		// 	let errorMsg = null
		// 	try {
		// 		output = await jsdomRender({ config, page, output, content })
		// 	} catch (err) {
		// 		errorMsg = err
		// 	}

		// 	if (errorMsg) {
		// 		output = before
		// 		if (config.SSRBuild) throw (errorMsg)
		// 		else error(errorMsg)
		// 	}
		// }

		return output
	}

	async function renderToFile (page) {
		let data = await render(page)
		const outputPath = path.join(config.paths.dist, config.baseURL, page.destination)

		const ext = path.extname(outputPath)
		const needsMinification = ext === '.html' && !config.development

		if (needsMinification) {
			data = minify(data, {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: false,
				minifyURLs: true
			})
		}

		await fs.ensureFile(outputPath)
		await fs.writeFile(outputPath, data, 'utf-8')
	}

	async function renderAll () {
		const pages = pagelist.getAll()
		for (const page of pages) { await renderToFile(page) }
	}
}
