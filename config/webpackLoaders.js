import autoprefixer from 'autoprefixer'
import mqpacker from 'css-mqpacker'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export default function webpackLoaders (config) {
	console.log(config)
	const paths = config.paths
	const loaders = []
	const includes = [paths.src]

	// JS Loaders
	const ifDefLoader = {
		loader: 'ifdef-loader',
		options: {
			DEVELOPMENT: config.development,
			PRODUCTION: config.environment === 'production',
			SSR: config.devServerBuild || config.SSRBuild,
			BROWSER: !config.devServerBuild && !config.SSRBuild
		}
	}

	const bubleLoader = {
		loader: 'buble-loader',
		options: {
			objectAssign: 'Object.assign',
			jsx: 'h',
			transforms: {
				modules: false,
				dangerousTaggedTemplateString: true
			}
		}
	}

	loaders.push({
		test: /\.js$/,
		include: includes,
		use: [
			bubleLoader,
			ifDefLoader
		]
	})

	// Style loader
	loaders.push(createStyleLoaders(config, includes))

	return loaders
}

function createStyleLoaders (config, includes) {
	const lazy = false

	const styleLoader = {
		loader: 'style-loader',
		options: {
			injectType: config.SSRBuild
				? (lazy ? 'lazySingletonStyleTag' : 'singletonStyleTag')
				: (lazy ? 'lazyStyleTag' : 'styleTag')
		}
	}

	const cssLoader = {
		loader: 'css-loader',
		options: {
			sourceMap: config.development,
			importLoaders: 2
		}
	}

	const postCssLoader = {
		loader: 'postcss-loader',
		options: {
			sourceMap: config.development,
			plugins: [
				autoprefixer(),
				mqpacker({ sort: true })
			]
		}
	}

	const stylusLoader = {
		loader: 'stylus-loader',
		options: {
			sourceMap: false,
			'include css': true,
			import: ['~style/colors', '~style/mq', '~style/utils']
		}
	}

	return {
		test: /\.styl$/,
		include: includes,
		use: [
			config.devServerBuild || config.SSRBuild
				? styleLoader
				: MiniCssExtractPlugin.loader,
			cssLoader,
			postCssLoader,
			stylusLoader
		]
	}
}
