keyMap = new Object()
let audioStarted = false
let t = 0
document.onkeydown = function (e) {
	if(keyNoteMap[e.key] == null)
		return
	if(!keyMap[e.key] || !keyMap[e.key].pressed){
    	keyMap[e.key] = {pressed: true, time: performance.now()}
		key = keyNoteMap[e.key]-9-24
		note = eval(noteEquation.value)
		for ( i in oscs ){
			if(!audioStarted){
				oscs[i].osc.start()
			}
			let newPitch = oscs[i].freqFunction(note)
			oscs[i].osc.frequency.setValueAtTime(newPitch, audioCtx.currentTime)
			oscs[i].osc.connect(oscs[i].vol)
		}
		audioStarted = true
	}
}

document.onkeyup = function (e) {
	if(keyNoteMap[e.key] == null)
		return
    keyMap[e.key] = {pressed: false, time: performance.now()}
	let keysDown = 0
	for ( key in keyMap ){
		if(keyMap[key].pressed){
			keysDown+=1
		}
	}
	if (keysDown == 0){
		for ( i in oscs ){
			oscs[i].osc.disconnect()
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
	  element.setAttribute(attr, attributes[attr])
	})
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

function generateFunction(string) {
    return new Function("note", 'return ' + string)
}

noteEquation = document.getElementById('noteEquation')
noteEquation.value = '440*pow(pow(2, 1/12), key)'
let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let masterLevel = audioCtx.createGain()
masterLevel.connect(audioCtx.destination)
let oscs = []
let key = 5
let note = eval(noteEquation.value)
createOsc(waveforms[3], 'note*2',	.2)
createOsc(waveforms[3], 'note*4+sin(50*t)*4',	.2)
createOsc(waveforms[3], 'note*(1+floor(t*8)%2)',	0.0)
console.log(waveforms)
function createOsc(wave, freqEquation, gain, volEquation){
	let volNode = audioCtx.createGain()
	let oscNode = {
		osc:			audioCtx.createOscillator(), 
		vol:			volNode,
		freqText:		freqEquation, 
		freqFunction:	generateFunction(freqEquation),
		volEquation: 	gain,
		volFunction:	generateFunction(volEquation)
	}
	oscs.push(oscNode)
	oscs[oscs.length-1].osc.type = wave
	oscs[oscs.length-1].osc.frequency.value = oscs[oscs.length-1].freqFunction(note)
	//oscs[oscs.length-1].osc.connect(oscs[oscs.length-1].vol)
	oscs[oscs.length-1].vol.gain.value = gain
	oscs[oscs.length-1].vol.connect(masterLevel)
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
	let oscAmpVal = createElement('input', {
		class: 'pitch',
 		type: 'text',
		value: volEquation
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

	oscPitchVal.innerText = oscs[oscs.length-1].osc.frequency.value
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
	oscs[oscIndex].vol.gain.value =  slider.value / 100
}

const changeOscType = function(container) {
	slider = container.querySelector('.type')
	oscIndex = container.id[3]
	oscs[oscIndex].osc.type =  waveforms[slider.value]
}

const changeOscPitch = function(container) {
	try {
	input = container.querySelector('.pitch')
	oscIndex = container.id[3]
	oscs[oscIndex].freqText = input.value
	oscs[oscIndex].freqFunction = generateFunction(oscs[oscIndex].freqText)
	} catch (e){}
	//oscs[oscIndex].osc.frequency.value = freq
}
const masterVol  = document.querySelector('#masterVol')
masterVol.addEventListener('input', () => changeVolume(masterVol))
// pitch.addEventListener('input', () => changePitch(pitch.value))

//https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}
// funky timer debugging shit note*1*(t*97.5-(f*1.5))
let pitches = []
let f = 0
async function updateLoop() {
	t = audioCtx.currentTime
	f++
	pitches = []
	for ( i in oscs ){
		pitches.push(oscs[i].osc.frequency.value)
	}
	for ( i in oscs ){
		try {
			let newPitch = oscs[i].freqFunction(note)
			oscs[i].osc.frequency.setValueAtTime(newPitch, t)
			
			if(f%5 == 0)
				document.getElementById('osc'+i+'Container').querySelector('.pitchVal').innerText = newPitch
		} catch (e) {}
	}
	await sleep(10)
	updateLoop()
}

updateLoop()

//functions for use inside  the equations

function sin(x){
	return Math.sin(x)
}
function tan(x){
	return Math.tan(x)
}
function cos(x){
	return Math.cos(x)
}
function floor(x){
	return Math.floor(x)
}
function rand(){
	return Math.random()
}
function pow(a,b){
	return Math.pow(a,b)
}
function max(a,b){
	return Math.max(a,b)
}
function min(a,b){
	return Math.min(a,b)
}
//clamps a between b and c
function clamp(a,b,c){
	high = max(b,c)
	low = min(b,c)
	return max(min(a,high),low)
}
