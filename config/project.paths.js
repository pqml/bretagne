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

		// Templates / snippets path (Used by node)
		templates: path.join(SRC, 'templates'),

		// Assets paths inside dist folder
		assetsDist: path.join(ROOT, 'dist', config.baseURL, 'bundle', config.hash),

		// Assets paths for front-end use
		assets: `${config.assetsBaseURL}bundle/${config.hash}`,

		// Quick fn to resolve assets path
		webpackAsset: url => `bundle/${config.hash}/${url}`
	}
}
