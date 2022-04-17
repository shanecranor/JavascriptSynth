function setAttributes(element, attributes) {
	Object.keys(attributes).forEach(attr => {
	  element.setAttribute(attr, attributes[attr]);
	});
}
function createElement(tag, attributes) {
	let elem = document.createElement(tag)
	setAttributes(elem, attributes)
	return elem
}

let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let masterLevel = audioCtx.createGain();
masterLevel.connect(audioCtx.destination)
oscs = []
createOsc('square', 33.7,	.2)
createOsc('square', 33.7*4,	.2)
function createOsc(oscType, freq, gain){
	let volNode = audioCtx.createGain()
	oscs.push([audioCtx.createOscillator(), volNode])
	oscs[oscs.length-1][0].type = oscType
	oscs[oscs.length-1][0].frequency.value = freq
	oscs[oscs.length-1][0].connect(oscs[oscs.length-1][1])
	oscs[oscs.length-1][1].gain.value = gain
	oscs[oscs.length-1][1].connect(masterLevel)
	oscs[oscs.length-1][0].start()
	let oscContainer = createElement('div', {
		id: 'osc' + (oscs.length-1) + 'Container'
	})
	let oscAmp = createElement('input', {
		class: 'amplitude',
 		type: 'range',
		min: 0, max: 100, value: 50
	})
	let oscTypeDropdown = createElement('input', {
		id: 'osc' + (oscs.length-1) + 'Slider',
 		type: 'range',
		min: 0, max: 100, value: 50
	})
	oscContainer.appendChild(oscAmp)
	//oscContainer.appendChild(oscTypeDropdown)
	document.getElementById('oscControls').appendChild(oscContainer)
	oscAmp.addEventListener('input', () => changeOscAmp(oscContainer))
}

const changeVolume = function(slider) {
	const value = slider.value / 100
	masterLevel.gain.value = value
}

const changeOscAmp = function(container) {
	slider = container.querySelector('.amplitude')
	oscIndex = container.id[3]
	oscs[oscIndex][1].gain.value =  slider.value / 100
}

const changePitch = function(freq) {
	oscs[0].frequency.value = freq
}
const masterVol  = document.querySelector('#masterVol')
masterVol.addEventListener('input', () => changeVolume(masterVol))
// pitch.addEventListener('input', () => changePitch(pitch.value))
