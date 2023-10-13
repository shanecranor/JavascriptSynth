let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let audioStarted = false

//html elements 
const noteEquation = document.getElementById('noteEquation')
noteEquation.value = '440*pow(pow(2, 1/12), key)'

const masterVol  = document.querySelector('#masterVol')
masterVol.addEventListener('input', () => changeVolume(masterVol))


let masterLevel = audioCtx.createGain()
let oscs = []
let key = 5
let note = eval(noteEquation.value)

// for update loop
let pitches = []
let amp = []
let ampPost = []
let f = 0
let t = 0

//start audio
masterLevel.connect(audioCtx.destination)

//create default OSCs
createOsc(waveforms[3], 'note*2',					.2,	"amp["+oscs.length+"]")
createOsc(waveforms[3], 'note*4+sin(50*t)*4',		.2,	"amp["+oscs.length+"]")
createOsc(waveforms[3], 'note*(1+floor(t*8)%2)',	0.0,"amp["+oscs.length+"]*(1+floor(t*2)%2)")


async function updateLoop() {
	t = audioCtx.currentTime
	f++
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


async function inputValueUpdateLoop(){
	pitches = []
	ampPost = []
	amp = []
	for ( i in oscs ){
		pitches.push(oscs[i].osc.frequency.value)
		ampPost.push(oscs[i].vol.gain.value)
		amp.push(oscs[i].volSlider)
	}
	await sleep(100)
	inputValueUpdateLoop()
}

updateLoop()
inputValueUpdateLoop()
