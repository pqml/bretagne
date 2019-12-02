import timestamp from '../utils/timestamp'

import createProjectConfig from '../../config/project.main'
import createProjectPaths from '../../config/project.paths'

export default function createConfig (opts = {}) {
	const config = Object.assign(
		{
			baseURL: '/',
			assetsBaseURL: '/'
		},
		createProjectConfig(),
		{
			development: opts.development,
			environment: opts.environment,
			hash: timestamp()
		})

	config.paths = createProjectPaths(config)

	// Computed values
	Object.assign(config, {
		// Will be set to true during the static rendering build
		SSRBuild: false,

		// Will be set to true when webpack is used from the dev server
		devServerBuild: !!opts.devServerBuild
	})

	return config
}
