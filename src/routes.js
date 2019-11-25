// You can render development-specific route using config.develompent

export default function createRoutes ({ config, views }) {
	if (!views) views = {}

	const list = []

	return {
		baseURL: config.baseURL || '/',
		locale: '/',
		views: list
	}
}
