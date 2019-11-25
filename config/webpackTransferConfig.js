export default function transferConfig (config) {
	return {
		baseURL: config.baseURL,
		hash: config.hash,
		assetsPath: config.paths.assets,
		env: config.environment,
		development: config.development
	}
}
