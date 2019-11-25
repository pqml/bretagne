import path from 'path'

export default function configPaths (config) {
	const ROOT = path.join(__dirname, '..')
	const SRC = path.join(ROOT, 'src')

	return {
		root: ROOT,
		src: SRC,
		dist: path.join(ROOT, 'dist'),
		static: path.join(ROOT, 'static'),

		// Copydeck files
		copydeck: path.join(ROOT, 'contents'),

		// Oscar front-end framework
		framework: path.join(ROOT, 'oscar', 'framework'),

		// Templates / snippets path (Used by node)
		templates: path.join(SRC, 'templates'),

		// Assets paths inside dist folder
		assetsDist: path.join(ROOT, 'dist', config.baseURL, 'assets', config.hash),

		// Assets paths for front-end use
		assets: `${config.assetsBaseURL}assets/${config.hash}`,

		// Quick fn to resolve assets path
		webpackAsset: url => `assets/${config.hash}/${url}`
	}
}
