export default function sound ({ soundButton }) {
	let active = false

	soundButton.onclick = e => {
		e.preventDefault()
		active = !active
		soundButton.textContent = 'Sound ' + (active ? 'Off' : 'On')
	}
}
