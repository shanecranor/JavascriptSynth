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

let waveforms = {
	0: 'sine',
	1: 'triangle',
	2: 'sawtooth',
	3: 'square'
}
let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let masterLevel = audioCtx.createGain();
masterLevel.connect(audioCtx.destination)
let oscs = []
createOsc(waveforms[2], 33.7,	.2)
createOsc(waveforms[0], 33.7*4,	.2)
console.log(waveforms)
function createOsc(wave, freq, gain){
	let volNode = audioCtx.createGain()
	oscs.push([audioCtx.createOscillator(), volNode])
	oscs[oscs.length-1][0].type = wave
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
	let oscType = createElement('input', {
		class: 'type',
 		type: 'range',
		min: 0, max: 3, value: 50
	})
	oscContainer.appendChild(oscAmp)
	oscAmp.addEventListener('input', () => changeOscAmp(oscContainer))
	oscContainer.appendChild(oscType)
	oscType.addEventListener('input', () => changeOscType(oscContainer))
	document.getElementById('oscControls').appendChild(oscContainer)
	
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

const changeOscType = function(container) {
	slider = container.querySelector('.type')
	oscIndex = container.id[3]
	oscs[oscIndex][0].type =  waveforms[slider.value]
}


const changePitch = function(freq) {
	oscs[0].frequency.value = freq
}
const masterVol  = document.querySelector('#masterVol')
masterVol.addEventListener('input', () => changeVolume(masterVol))
// pitch.addEventListener('input', () => changePitch(pitch.value))
