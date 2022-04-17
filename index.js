let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let masterLevel = audioCtx.createGain();
masterLevel.connect(audioCtx.destination)
oscs = []
createOsc('square', 33.7,	.5)
createOsc('square', 33.7*4,	.5)
function createOsc(oscType, freq, gain){
	oscs.push([audioCtx.createOscillator(), audioCtx.createGain()])
	oscs[oscs.length-1][0].type = oscType
	oscs[oscs.length-1][0].frequency.value = freq
	oscs[oscs.length-1][0].connect(oscs[0][1])
	oscs[oscs.length-1][1].gain.value = gain
	oscs[oscs.length-1][1].connect(masterLevel)
	oscs[oscs.length-1][0].start()
	oscVolSlider = document.createElement('input')
	oscVolSlider.id = 'osc' + (oscs.length-1) + 'Slider'
	console.log('osc' + (oscs.length-1) + 'Slider' )
	oscVolSlider.type = 'range'
	oscVolSlider.min = 0
	oscVolSlider.max = 100
	oscVolSlider.value = 50
	document.getElementById('oscControls').appendChild(oscVolSlider)
	oscVolSlider.addEventListener('input', () => changeOscAmp(oscVolSlider))
}

const changeVolume = function(slider) {
	const value = slider.value / 100
	masterLevel.gain.value = value
}

const changeOscAmp = function(slider) {
	const value = slider.value / 100
	oscIndex = slider.id[3]
	console.log(slider.id)
	oscs[oscIndex][1].gain.value = value
	//console.log(oscs[oscIndex][1])
}
const changePitch = function(freq) {
	oscs[0].frequency.value = freq
}
const masterVol  = document.querySelector('#masterVol')
//const amplitude = document.querySelector('#amplitude')
//const pitch = document.querySelector('#pitch')

masterVol.addEventListener('input', () => changeVolume(masterVol))
pitch.addEventListener('input', () => changePitch(pitch.value))
