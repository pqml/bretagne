export default function timestamp () {
	const date = new Date()
		.toISOString()
		.split('.')[0]
		.replace(/:|-/gi, '')
		.replace(/T/gi, '_')

	return date
}
