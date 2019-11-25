import { promisify } from 'util'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import createWebpackConfig from '../../config/webpackConfig'

import getEntries from './getEntries'
import getPort from './getPort'

async function waitFirstBuild (config, compiler) {
	let done = false
	return new Promise(resolve => {
		compiler.hooks.done.tap('oscar-done', stats => {
			if (done) return
			done = true

			const entriesList = Array.from(stats.compilation.assetsInfo.keys())
			const entries = getEntries(config, entriesList)

			process.nextTick(() => resolve({ entries }))
		})
	})
}

export default async function webpackServe (config = {}) {
	if (!config.webpack) config.webpack = {}
	if (!config.devServer) config.devServer = {}

	// Prepare arguments (port selection for instance)
	const port = config.devServer.port = await getPort(config.devServer.port || 3000)
	const webpackConfig = createWebpackConfig(config)

	const proto = webpackConfig.devServer.https ? 'https' : 'http'
	const host = webpackConfig.devServer.host
	const url = `${proto}://${host}:${port}${config.baseURL}`

	// Create the webpack instance, wait for first build
	const compiler = webpack(webpackConfig)
	if (config.webpack.useCompiler) config.webpack.useCompiler.useCompiler(compiler)

	const server = new WebpackDevServer(compiler, webpackConfig.devServer)
	const { entries } = await waitFirstBuild(config, compiler)

	// Listen the dev server
	const listen = promisify(server.listen.bind(server))
	await listen(port, host)

	return { url, entries }
}
