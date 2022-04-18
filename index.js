keyMap = new Object()
let audioStarted = false
let t = 0
document.onkeydown = function (e) {
	if(keyNoteMap[e.key] == null)
		return
	if(!keyMap[e.key] || !keyMap[e.key].pressed){
    	keyMap[e.key] = {pressed: true, time: performance.now()};
		key = keyNoteMap[e.key]-9-24
		note = eval(noteEquation.value)
		for ( i in oscs ){
			if(!audioStarted){
				oscs[i][0].start()
			}
			let newPitch = eval(oscs[i][2])
			oscs[i][0].frequency.value = newPitch
			oscs[i][0].connect(oscs[i][1])
		}
		audioStarted = true
	}
}

document.onkeyup = function (e) {
	if(keyNoteMap[e.key] == null)
		return
    keyMap[e.key] = {pressed: false, time: performance.now()};
	let keysDown = 0
	for ( key in keyMap ){
		if(keyMap[key].pressed){
			keysDown+=1
		}
	}
	if (keysDown == 0){
		for ( i in oscs ){
			oscs[i][0].disconnect()
		}
	}
}

keyNoteMap = {
	'q':	-1,
	'a':	0,
	'w':	1,
	's':	2,
	'e':	3,
	'd':	4,
	'f':	5,
	't':	6,
	'g' :	7,
	'y' :	8,
	'h' :	9,
	'u' :	10,
	'j' :	11,
	'k' :	12,
	'o' :	13,
	'l' :	14,
	'p' :	15,
	';' :	16,
	"'" :	17,
	']' :	18,
	'Enter':19
}

//https://stackoverflow.com/questions/12274748/setting-multiple-attributes-for-an-element-at-once-with-javascript
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
noteEquation = document.getElementById('noteEquation')
noteEquation.value = '440*pow(pow(2, 1/12), key)'
let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let masterLevel = audioCtx.createGain();
masterLevel.connect(audioCtx.destination)
let oscs = []
let key = 5
let note = eval(noteEquation.value)
createOsc(waveforms[3], 'note*2',	.2)
createOsc(waveforms[3], 'note*4+sin(t)',	.2)
console.log(waveforms)
function createOsc(wave, freqEquation, gain){
	let volNode = audioCtx.createGain()
	oscs.push([audioCtx.createOscillator(), volNode, freqEquation])
	oscs[oscs.length-1][0].type = wave
	oscs[oscs.length-1][0].frequency.value = eval(freqEquation)
	//oscs[oscs.length-1][0].connect(oscs[oscs.length-1][1])
	oscs[oscs.length-1][1].gain.value = gain
	oscs[oscs.length-1][1].connect(masterLevel)
	let oscContainer = createElement('div', {
		id: 'osc' + (oscs.length-1) + 'Container'
	})
	let oscLabel = createElement('p', {
		class: 'oscLabel',
		style: 'display: inline; padding-right: 10px;'
	})
	let oscAmp = createElement('input', {
		class: 'amplitude',
 		type: 'range',
		min: 0, max: 100, value: gain*100
	})
	let oscType = createElement('input', {
		class: 'type',
 		type: 'range',
		min: 0, max: 3, value: 3
	})
	let oscPitch = createElement('input', {
		class: 'pitch',
 		type: 'text',
		value: freqEquation
	})
	let oscPitchVal = createElement('p', {
		class: 'pitchVal',
		style: 'display: inline; padding-left: 10px;'
	})
	oscLabel.innerText = 'osc' + (oscs.length-1)
	oscContainer.appendChild(oscLabel)
	oscContainer.appendChild(oscAmp)
	oscAmp.addEventListener('input', () => changeOscAmp(oscContainer))
	
	oscContainer.appendChild(oscType)
	oscType.addEventListener('input', () => changeOscType(oscContainer))
	
	oscContainer.appendChild(oscPitch)
	oscPitch.addEventListener('input', () => changeOscPitch(oscContainer))

	oscPitchVal.innerText = oscs[oscs.length-1][0].frequency.value
	oscContainer.appendChild(oscPitchVal)
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

const changeOscPitch = function(container) {
	input = container.querySelector('.pitch')
	oscIndex = container.id[3]
	oscs[oscIndex][2] = input.value
	//oscs[oscIndex][0].frequency.value = freq
}
const masterVol  = document.querySelector('#masterVol')
masterVol.addEventListener('input', () => changeVolume(masterVol))
// pitch.addEventListener('input', () => changePitch(pitch.value))

//https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
function sin(x){
	return Math.sin(x)
}
function cos(x){
	return Math.cos(x)
}
function rand(){
	return Math.random()
}
function pow(a,b){
	return Math.pow(a,b)
}

async function updateLoop() {
	t += 1

	// for (i in keyMap){
	// 	if(keyMap[i].pressed){
	// 		key = keyNoteMap[i]-9-24
	// 	}
	// }
	// note = eval(noteEquation.value)
	let pitches = []
	for ( i in oscs ){
		pitches.push(oscs[i][0].frequency.value)
	}
	for ( i in oscs ){
		try {
			let newPitch = eval(oscs[i][2])
			oscs[i][0].frequency.value = newPitch
			if(t%5 == 0)
				document.getElementById('osc'+i+'Container').querySelector('.pitchVal').innerText = newPitch
		} catch (e) {}
	}
	await sleep(10)
	updateLoop()
}

updateLoop()
