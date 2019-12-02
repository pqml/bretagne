import content from './bretagne.content'
import fonts from './bretagne.fonts'

export default function configMain () {
	return {
		// Site base URL (usually override by env)
		baseURL: '/',

		// Assets location (usually override by env)
		assetsBaseURL: '/',

		content,

		fonts
	}
}
