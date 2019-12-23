import fs from 'fs-extra'

export default async function cleanFolder (path) {
	if (!path) return
	await fs.ensureDir(path)
	await fs.remove(path)
	await fs.ensureDir(path)
}
