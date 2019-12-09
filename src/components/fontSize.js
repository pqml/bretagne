export default function fontSize ({ visualizer, increase, decrease, resizerValue }) {
	const sizes = [6, 8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 84, 92]
	let index = 0

	increase.onclick = e => update(e, Math.min(sizes.length - 1, index + 1))
	decrease.onclick = e => update(e, Math.max(0, index - 1))

	update(null, 11)

	function update (e, nIndex) {
		e && e.preventDefault()
		if (nIndex === index) return
		index = nIndex
		const s = sizes[index]
		resizerValue.textContent = (s < 10 ? '0' : '') + s + 'pt'
		visualizer.style.fontSize = s + 'px'
		visualizer.style.lineHeight = s * 1.3 + 'px'
	}
}
