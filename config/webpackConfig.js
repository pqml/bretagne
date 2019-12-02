/*

createWebpackConfig()
────────────────────
Create the webpack configuration, used different parameters
────────────────────

webpackConfig = createWebpackConfig({
	config: {}, // Project configuration,
	port: 3000, // Port for the webpack-dev-server (default 3000)
	before: () => {}, // `before` option of the webpack-dev-server
	after: () => {} // `after` option of the webpack-dev-server
})

*/

import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'

import hosts from '../node/webpack/allowedHosts'

import webpackLoaders from './webpackLoaders'
import webpackPlugins from './webpackPlugins'

export default function webpackConfig (config) {
	const devServer = config.devServer || {}
	const paths = config.paths
	const publicPath = `${config.baseURL}`

	const webpackConfig = {

		module: { rules: webpackLoaders(config) },
		mode: config.development ? 'development' : 'production',

		plugins: webpackPlugins(config),

		devtool: config.development ? 'cheap-module-eval-source-map' : false,

		entry: {
			bundle: [
				path.join(paths.src, 'app.js'),
				path.join(paths.src, 'app.styl')
			]
		},

		output: {
			path: path.join(paths.dist, config.baseURL),
			publicPath: publicPath,
			filename: paths.webpackAsset('js/[name].js'),
			chunkFilename: paths.webpackAsset('js/[name].chunk.js')
		},

		resolve: {
			alias: {
			},
			extensions: ['.js', '.glsl', '.yml'],
			symlinks: true,
			unsafeCache: true
		},

		watchOptions: {
			ignored: /node_modules/,
			aggregateTimeout: 100,
			poll: 100
		},

		devServer: {
			injectClient: true,
			injectHot: true,
			clientLogLevel: 'debug',
			contentBase: paths.dist,
			publicPath: publicPath,
			disableHostCheck: true,
			historyApiFallback: true,
			host: devServer.host || '0.0.0.0',
			allowedHosts: hosts || [],
			https: devServer.https !== undefined ? !!devServer.https : false,
			hot: true,
			overlay: true,
			port: devServer.port || 3000,
			before: devServer.before,
			after: devServer.after,
			stats: {
				env: true,
				all: false,
				assets: true,
				assetsSort: 'name',
				colors: true,
				errors: true,
				timings: true,
				warnings: true,
				excludeAssets: [/.map/, /.hot-update.js/, /\.\/node_modules/]
			}
		},

		optimization: {
			minimize: (!config.development && !config.SSRBuild),
			minimizer: (!config.development && !config.SSRBuild) ? [
				new TerserPlugin({
					parallel: true,
					terserOptions: {
						ecma: 6,
						module: true,
						toplevel: true,
						warnings: false,
						compress: {
							drop_console: true,
							dead_code: true,
							keep_infinity: true,
							passes: 3
						},
						output: {
							comments: false
						}
					}
				})
			] : [
			],
			noEmitOnErrors: true
		}
	}

	return webpackConfig
}
