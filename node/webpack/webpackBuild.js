import { promisify } from 'util'
import webpack from 'webpack'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'

import { green, gray, log } from '../utils/logger'

import createWebpackConfig from '../../config/webpackConfig'

import getEntries from './getEntries'

export default async function webpackBuild (config = {}) {
	if (!config.webpack) config.webpack = {}

	// Prepare arguments (port selection for instance)
	const webpackConfig = createWebpackConfig(config)

	// Create the webpack instance, wait for first build
	const compiler = webpack(webpackConfig)
	if (config.webpack.useCompiler) config.webpack.useCompiler.useCompiler(compiler)

	// Add a progress bar plugin
	new ProgressBarPlugin({
		incomplete: gray('·'),
		complete: green('·'),
		format: gray('   ↳') + green('  :percent ') + ':bar',
		clear: true,
		summary: false,
		customSummary: time => log(gray('   ↳') + green(`  ✔  ${time}\n`))
	}).apply(compiler)

	const run = promisify(compiler.run.bind(compiler))
	const stats = await run()
	const entriesList = Array.from(stats.compilation.assetsInfo.keys())
	const entries = getEntries(config, entriesList)

	// Check for build error
	stats.compilation.modules.forEach(module => {
		if (module.error) throw (module.error)
	})

	return { entries }
}
