import content from './bretagne.content'
import fonts from './bretagne.fonts'
import { getFontCss } from '../src/utils/fontManager'
import spanify from '../src/utils/spanify'

export default function configMain () {
	let style = ''

	const slugs = [].concat.apply([],
		fonts.map(family => family.fonts.map(v => v.slug))
	)

	fonts.forEach(
		family => family.fonts.forEach(fonts => (style += getFontCss(fonts)))
	)

	content.sample = spanify(content.sample, slugs)

	return {
		// Site base URL (usually override by env)
		baseURL: '/',

		// Assets location (usually override by env)
		assetsBaseURL: '/',

		content,

		fonts,

		style
	}
}
