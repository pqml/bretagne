
function isDay () {
	const now = new Date()
	now.setMinutes(now.getMinutes() + 30)
	const hours = now.getHours()
	const isDay = hours > 6 && hours < 23
	return isDay
}

export default function sound ({ soundButton }) {
	let active = false

	const tag = document.createElement('audio')
	document.body.appendChild(tag)
	tag.setAttribute('loop', '')
	tag.setAttribute('preload', 'auto')
	tag.loop = true
	tag.preload = 'auto'
	tag.src = isDay()
		? 'sounds/bretagne_bande-originale_jour.mp3'
		: 'sounds/bretagne_bande-originale_nuit.mp3'

	document.body.appendChild(tag)

	soundButton.onclick = e => {
		e.preventDefault()
		active = !active
		soundButton.textContent = 'Sound ' + (active ? 'On' : 'Off')

		if (active) tag.play()
		else tag.pause()
	}
}
