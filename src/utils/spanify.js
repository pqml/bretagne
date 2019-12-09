export default function spanify (str, slugs) {
	const splitted = str
		.replace(/[\r\n]/g, ' ')
		.split(' ')
		.filter(v => v)

	const parts = []

	let count = 0

	splitted.forEach(v => {
		v = v.trim()
		if (v.length < 1) return

		// if (v.replace(/<br>/g, '').length > 0) count++
		// else count += 10 - (count % 10) + 1
		count++

		const id = Math.floor(count / 10)
		if (!parts[id]) parts[id] = []
		parts[id].push(v)
	})

	const out = parts.map((a, i) => (
		`<span style="font-family:'` +
		slugs[i % slugs.length] +
		`'">` +
		a.join(' ') +
		` </span>`
	)).join('')

	return out
}
