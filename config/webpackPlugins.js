import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssoWebpackPlugin from 'csso-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

import transferConfig from './webpackTransferConfig'

export default function webpackPlugins (config) {
	const plugins = []
	const paths = config.paths

	config.devServerBuild && plugins.push(
		new webpack.HotModuleReplacementPlugin()
	)

	const defines = {
		CONFIG: JSON.stringify(transferConfig(config)),
		IS_DEVELOPMENT: JSON.stringify(config.development),
		IS_PRODUCTION: JSON.stringify(!config.development),
		IS_DEVSERVER: JSON.stringify(config.devServerBuild)
	}

	if (!config.devServerBuild) {
		defines.IS_SSR = JSON.stringify(config.SSRBuild)
		defines.IS_BROWSER = JSON.stringify(!config.SSRBuild)
	}

	plugins.push(new webpack.DefinePlugin(defines))

	// CSS Extract plugin
	!config.SSRBuild && !config.devServerBuild && plugins.push(
		new MiniCssExtractPlugin({
			filename: paths.webpackAsset('css/[name].css'),
			chunkFilename: paths.webpackAsset('css/[name].chunk.css')
		})
	)

	// CSSO (css minifier) plugin
	!config.development && plugins.push(
		new CssoWebpackPlugin({
			comments: false,
			forceMediaMerge: true,
			restructure: true
		})
	)

	// Copy (static files) plugin
	plugins.push(
		new CopyPlugin([
			{ from: `${paths.static}` }
		])
	)

	return plugins
}
