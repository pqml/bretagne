import path from 'path'

import createConfig from '../config/createConfig'
import { success, cyan, log, yellow, gray, error, green } from '../utils/logger'
import cleanFolder from '../utils/cleanFolder'

(async () => {
	try {
		const taskBegin = new Date()
		const config = createConfig({
			devServerBuild: false,
			environment: 'production',
			development: false
		})

		log(cyan(`Bretagne \n`))
		log(`Hash:  ${yellow(config.hash)}`)
		log(`Env:  ${yellow(config.environment + ' served')}\n`)

		// Use a step to import webpack because it takes long
		log(gray(`→  Create dependency tree...`))
		const webpackBuild = require('../webpack/webpackBuild').default
		const createStaticRenderer = require('../staticRenderer/staticRenderer').default

		// Clean dist folder and create a fresh new one
		log(gray(`→  Clean dist folder...`))
		await cleanFolder(config.paths.dist)

		// Prepare static renderer
		log(gray(`→  Render static files...`))
		const staticBegin = new Date()
		const createPages = require(path.join(config.paths.src, 'pages.js')).default
		const createRoutes = require(path.join(config.paths.src, 'routes.js')).default
		const routes = createRoutes({ config })
		const pages = await createPages({ config, routes })
		const staticRenderer = createStaticRenderer({ config, routes, pages })
		await staticRenderer.launch()
		await staticRenderer.renderAll()
		const staticElapsed = ((new Date() - staticBegin) / 1000).toFixed(3)
		log(gray('\n   ↳') + green(`  ✔  ${staticElapsed}s\n`))

		// // Build webpack for static rendering
		log(gray(`→  Bundle webpack...\n`))
		await webpackBuild(config)

		const taskElapsed = ((new Date() - taskBegin) / 1000).toFixed(3)
		success(`Build complete in ${cyan(taskElapsed + 's')}`)
	} catch (err) {
		error(err)
	}
})()
