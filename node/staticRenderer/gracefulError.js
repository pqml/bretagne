import { error } from '../utils/logger'

// Display error both on the browser and the console,
// to avoid breaking the auto-reload of the devserver
export default function gracefulError (res, err) {
	error(err)
	res.setHeader('Content-Type', 'text/html; charset=utf-8')
	res.end(
		'<html><head></head><body><pre style=' +
		'"white-space:pre-wrap;word-wrap:break-word;font-family:monospace;' +
		'font-size:18px;color:red">' +
		'✖ Static Renderer Error \n' +
		'─────────────────────── \n\n' +
		err + '</pre></body></html>'
	)
}
