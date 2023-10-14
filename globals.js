let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let audioStarted = false

//html elements 
const noteEquation = document.getElementById('noteEquation')
noteEquation.value = '440*pow(pow(2, 1/12), key)'
let noteEquationValue = noteEquation.value
noteEquation.addEventListener('input', () => changeNoteEquation(noteEquation))

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
			if(newPitch) oscs[i].osc.frequency.setValueAtTime(newPitch, t)
            let newVol = oscs[i].volFunction() 
            if(newVol) oscs[i].vol.gain.setValueAtTime(newVol, t)
            //update the pitch display every 10 frames
            //round pitch to nearest 10th but ensure consistant string length
            //eg 440.0 instead of 440
			if(f%10 == 0)
				oscs[i].containerEl.querySelector('.pitchVal').innerText = newPitch.toFixed( 1)

            if(true){
                oscs[i].freqHistory.push(newPitch)
                if(oscs[i].freqHistory.length > 100)
                    oscs[i].freqHistory.shift()
                updateFreqGraph(oscs[i].freqHistory, i)
            }

		} catch (e) {
            console.error(e)
        }
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
