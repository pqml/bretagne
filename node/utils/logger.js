import { red, green, yellow } from 'kleur'
export { cyan, blue, red, green, yellow, gray } from 'kleur'
// const PREFIX = '';

const hasArgs = (args) => {
	return !(
		!args ||
		!args.length ||
		(args.length === 1 && args[0] === undefined)
	)
}

export function log (...msg) {
	const args = hasArgs(msg)
	// msg.unshift( blue( PREFIX + ':' ) );
	if (!args) console.log(msg[0])
	else console.log(...msg)
}

export function success (...msg) {
	const args = hasArgs(msg)
	msg.unshift('\n✨ ' + green('Success' + (hasArgs(msg) ? ':' : '!')))
	if (!args) console.log(msg[0])
	else console.log(...msg)
}

export function warn (...msg) {
	const args = hasArgs(msg)
	msg.unshift('⚡️ ' + yellow('Warning' + (hasArgs(msg) ? ':' : '!')))
	if (!args) console.log(msg[0])
	else console.log(...msg)
}

export function error (...msg) {
	const args = hasArgs(msg)
	msg.unshift('\n💀 ' + red('Error' + (hasArgs(msg) ? ':' : '.')))
	if (!args) console.log(msg[0])
	else console.log(...msg)
}

export function exit (...msg) {
	const args = hasArgs(msg)
	msg.unshift('\n💀 ' + red('Error' + (args ? ':' : '.')))
	if (!args) console.log(msg[0])
	else console.log(...msg)
	process.exit(0)
}
