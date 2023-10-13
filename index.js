let audioStarted = false
let t = 0
function keyPress(e, isPressed){
	keyMap[e.key] =  {pressed: isPressed, time: performance.now()}
}
function triggerOscs(e){
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

document.onkeydown = (e) => {
	if(keyNoteMap[e.key] == null) return
	if(!keyMap[e.key] || !keyMap[e.key].pressed){
		keyPress(e, true)
		triggerOscs(e)
	}
}

document.onkeyup = (e) => {
	if(keyNoteMap[e.key] == null) return
	keyPress(e, false)
	let keysDown = 0
	for ( key in keyMap ){
		if(keyMap[key].pressed){
			keysDown+=1
		}
	}
	//loop through the keymap and check to see the most recently pressed key, then trigger that osc
	let mostRecent = 0
	let mostRecentKey = ''
	let anyPressed = false
	for ( key in keyMap ){
		if(keyMap[key].pressed && keyMap[key].time > mostRecent){
			mostRecent = keyMap[key].time
			mostRecentKey = key
			anyPressed = true
		}
	}
	if(anyPressed){
		key = keyNoteMap[mostRecentKey]-9-24
		note = eval(noteEquation.value)
	}else {
		for ( i in oscs ){
			oscs[i].osc.disconnect()
		}
	}
}


noteEquation = document.getElementById('noteEquation')
noteEquation.value = '440*pow(pow(2, 1/12), key)'
let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let masterLevel = audioCtx.createGain()
masterLevel.connect(audioCtx.destination)
let oscs = []
let key = 5
let note = eval(noteEquation.value)
createOsc(waveforms[3], 'note*2',					.2,	"amp["+oscs.length+"]")
createOsc(waveforms[3], 'note*4+sin(50*t)*4',		.2,	"amp["+oscs.length+"]")
createOsc(waveforms[3], 'note*(1+floor(t*8)%2)',	0.0,"amp["+oscs.length+"]*(1+floor(t*2)%2)")


const changeVolume = function(slider) {
	const value = slider.value / 100
	masterLevel.gain.value = value
}

const changeOscAmp = function(container) {
	slider = container.querySelector('.amplitude')
	oscIndex = container.id[3]
	oscs[oscIndex].volSlider =  slider.value / 100
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
	oscs[oscIndex].freqFunction = generateNoteFunction(oscs[oscIndex].freqText)
	} catch (e){}
}

const changeOscAmpVal = function(container) {
	input = container.querySelector('.ampVal')
	oscIndex = container.id[3]
	oscs[oscIndex].volEquation = input.value
	oscs[oscIndex].volFunction = generateFunction(oscs[oscIndex].volEquation)
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
let amp = []
let ampPost = []
let f = 0
async function updateLoop() {
	t = audioCtx.currentTime
	f++
	//TODO: reseting pitches and amp arrays every cycle is probably slow... but whatver
	pitches = []
	ampPost = []
	amp = []
	for ( i in oscs ){
		pitches.push(oscs[i].osc.frequency.value)
		ampPost.push(oscs[i].vol.gain.value)
		amp.push(oscs[i].volSlider)
	}
	for ( i in oscs ){
		try {
			let newPitch = oscs[i].freqFunction(note)
			oscs[i].osc.frequency.setValueAtTime(newPitch, t)
			if(f%10 == 0)
				document.getElementById('osc'+i+'Container').querySelector('.pitchVal').innerText = newPitch
			let newVol = oscs[i].volFunction()
			oscs[i].vol.gain.setValueAtTime(newVol, t)
		} catch (e) {}
	}
	await sleep(10)
	updateLoop()
}

updateLoop()

//functions for use inside  the equations so you don't need to type Math. everything (why javascript)

function sin(x)  {	return Math.sin(x)	}
function tan(x)  {	return Math.tan(x)	}
function cos(x)  {	return Math.cos(x)	}
function floor(x){	return Math.floor(x)}
function ceil(x) {	return Math.floor(x)}
function rand()  {	return Math.random()}
function pow(a,b){	return Math.pow(a,b)}
function max(a,b){	return Math.max(a,b)}
function min(a,b){	return Math.min(a,b)}
function round(x){  return Math.round(x)}
//clamps a between b and c
function clamp(a,b,c){
	high = max(b,c)
	low = min(b,c)
	return max(min(a,high),low)
}
