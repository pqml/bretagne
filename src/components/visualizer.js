import spanify from '../utils/spanify'
import setSelectionRange from '../utils/setSelectionRange'

export default function visualizer ({ visualizer }) {
	const slugs = FONTS
		.map(family => family.fonts)
		.reduce((p, v) => p.concat(v), [])
		.map(v => v.slug)

	// const content = window.getSelection().toString()
	// visualizer.innerHTML = format(content, slugs)

	visualizer.addEventListener('input', e => {
		if (e.isComposing) return

		const sel = window.getSelection()
		const focusNode = sel.focusNode
		const focusOffset = sel.focusOffset
		sel.setBaseAndExtent(visualizer, 0, focusNode, focusOffset)
		const absOffset = sel.toString().length

		document.execCommand('selectAll', false, null)
		const content = window.getSelection().toString()

		visualizer.innerHTML = format(content, slugs)

		setSelectionRange(visualizer, absOffset, absOffset)
		// sel.setBaseAndExtent(visualizer.childNodes[0], absOffset, visualizer.childNodes[0], absOffset)
		// console.log(content)
	})
}

function format (content, slugs) {
	content = content.replace(/\n/g, '<br>')
	content = spanify(content, slugs)
	content = content.replace(/<br>/g, '\n')
	return content
}
