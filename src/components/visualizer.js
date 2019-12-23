export default function visualizer ({ visualizer }) {
	visualizer.addEventListener('input', function () {
		const sel = window.getSelection()

		const textSegments = decompose(visualizer)
		const textContent = textSegments.map(({ text }) => text).join('')
		console.log(textContent)
		const anchorIndex = 0
		const focusIndex = 0
		const i = 0

		console.log(
			sel.anchorNode.textContent.length,
			sel.anchorOffset,
			sel.focusNode,
			sel.focusOffset
		)

		// let anchorNode = sel.anchorNode
		// if (anchorNode.nodeType !== window.Node.TEXT_NODE) {
		// 	anchorNode = anchorNode.childNodes[0]
		// }

		// let focusNode = sel.focusNode
		// if (focusNode.nodeType !== window.Node.TEXT_NODE) {
		// 	focusNode = focusNode.childNodes[0]
		// }
		// console.log(anchorNode)

		// textSegments.forEach(({ text, node, skip }) => {
		// 	if (skip) return
		// 	if (node === anchorNode) anchorIndex = i + sel.anchorOffset
		// 	if (node === focusNode) focusIndex = i + sel.focusOffset
		// 	i += text.length
		// })

		// let content = textContent
		// content = content.replace(/\n/g, '<br>')
		// visualizer.innerHTML = content

		// restoreSelection(visualizer, anchorIndex, focusIndex)
	}, false)

	let disableBr = false
	function decompose (element) {
		const textSegments = []
		Array.from(element.childNodes).forEach((node) => {
			const tag = node.tagName
			const type = node.nodeType

			if (type === window.Node.TEXT_NODE) {
				textSegments.push({ text: node.nodeValue, node })
			} else if (type === window.Node.ELEMENT_NODE) {
				if (tag === 'BR') {
					if (!disableBr) textSegments.push({ text: '\n', node })
					disableBr = false
				} else if (tag === 'DIV') {
					textSegments.push({ text: '\n', node, skip: true })
					disableBr = true
				}
				textSegments.splice(textSegments.length, 0, ...(decompose(node)))
			}
		})

		return textSegments
	}

	function restoreSelection (editor, absAnchorIndex, absFocusIndex) {
		const sel = window.getSelection()
		const textSegments = decompose(editor)
		let anchorNode = editor
		let focusNode = editor
		let anchorIndex = 0
		let focusIndex = 0
		let currentIndex = 0
		textSegments.forEach(({ text, node }) => {
			const startIndexOfNode = currentIndex
			const endIndexOfNode = startIndexOfNode + text.length
			if (startIndexOfNode <= absAnchorIndex && absAnchorIndex <= endIndexOfNode) {
				anchorNode = node
				anchorIndex = absAnchorIndex - startIndexOfNode
			}
			if (startIndexOfNode <= absFocusIndex && absFocusIndex <= endIndexOfNode) {
				focusNode = node
				focusIndex = absFocusIndex - startIndexOfNode
			}
			currentIndex += text.length
		})

		sel.setBaseAndExtent(anchorNode, anchorIndex, focusNode, focusIndex)
	}
}
