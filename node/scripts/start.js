import path from 'path'
import createConfig from '../config/createConfig'
import cleanFolder from '../utils/cleanFolder'
import { success, cyan, log, yellow, gray, error } from '../utils/logger'
import createLiveReloader from '../webpack/createLivereloader'

(async () => {
	try {
		const config = createConfig({
			devServerBuild: true,
			environment: 'development',
			development: true
		})

		log(cyan(`Bretagne \n`))
		log(`Hash:  ${yellow(config.hash)}`)
		log(`Env:  ${yellow(config.environment + ' served')}\n`)

		// Use a step to import webpack because it takes long
		log(gray(`→  Create dependency tree...`))
		const webpackServe = require('../webpack/webpackServe').default
		const createStaticRenderer = require('../staticRenderer/staticRenderer').default

		// Clean dist folder and create a fresh new one
		log(gray(`→  Clean dist folder...`))
		await cleanFolder(config.paths.dist)

		// Prepare static renderer
		log(gray(`→  Start Static Renderer...`))
		const createPages = require(path.join(config.paths.src, 'pages.js')).default
		const createRoutes = require(path.join(config.paths.src, 'routes.js')).default
		const routes = createRoutes({ config })
		const pages = await createPages({ config, routes })
		const staticRenderer = createStaticRenderer({ config, routes, pages })
		await staticRenderer.launch()

		// Start and listen webpack dev server
		log(gray(`→  Start Webpack server...\n`))
		config.devServer = Object.assign(config.devServer || {}, {
			before: (app, server) => {
				const liveReloader = createLiveReloader(server)
				staticRenderer.middleware.setLiveReloader(liveReloader)
				app.use(staticRenderer.middleware)
			}
		})
		const { url, entries } = await webpackServe(config)

		// Set entries usable by the static renderer
		config.devServerUrl = url
		staticRenderer.setEntries(entries)

		success(`Server started on ${cyan(url)}\n`)
	} catch (err) {
		error(err)
	}
})()
