import fs from 'fs-extra'
import path from 'path'

export default async function appendLoadJS (data) {
	const ljs = await fs.readFile(
		path.resolve(__dirname, '../../node_modules/loadjs/dist/loadjs.min.js'),
		'utf8'
	)

	data.loadjs = ljs.replace(/^loadjs=/, '')
}
