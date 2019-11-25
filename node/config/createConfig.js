import timestamp from '../utils/timestamp'

import createMain from '../../config/configMain'
import createPaths from '../../config/configPaths'

export default function createConfig (opts = {}) {
	const config = Object.assign(
		{
			baseURL: '/',
			assetsBaseURL: '/'
		},
		createMain(),
		{
			development: opts.development,
			environment: opts.environment,
			hash: timestamp()
		})

	config.paths = createPaths(config)

	// Computed values
	Object.assign(config, {
		// Will be set to true during the static rendering build
		SSRBuild: false,

		// Will be set to true when webpack is used from the dev server
		devServerBuild: !!opts.devServerBuild
	})

	return config
}
