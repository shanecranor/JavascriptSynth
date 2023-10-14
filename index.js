

function keyPress(e, isPressed){
	keyMap[e.key] =  {pressed: isPressed, time: performance.now()}
}
function triggerOscs(e){
	key = keyNoteMap[e.key]-9-24
	note = eval(noteEquationValue)
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
		note = eval(noteEquationValue)
	}else {
		for ( i in oscs ){
			oscs[i].osc.disconnect()
		}
	}
}



const changeVolume = function(slider) {
	const value = slider.value / 100
	masterLevel.gain.value = value
}

const changeOscAmp = function(container) {
	slider = container.querySelector('.amplitude')
	oscIndex = container.id.split("-")[1]
	oscs[oscIndex].volSlider =  slider.value / 100
}

const changeOscType = function(container) {
	slider = container.querySelector('.type')
	oscIndex = container.id.split("-")[1]
	oscs[oscIndex].osc.type =  waveforms[slider.value]
}

const changeOscPitch = function(container) {
	try {
	const input = container.querySelector('.pitch')
	oscIndex = container.id.split("-")[1]
	oscs[oscIndex].freqText = input.value
	oscs[oscIndex].freqFunction = generateNoteFunction(oscs[oscIndex].freqText)
	container.querySelector('.pitch').style.backgroundColor = 'black'

	} catch (e){
		container.querySelector('.pitch').style.backgroundColor = 'red'
		console.error(e)

	}
}

const changeOscAmpVal = function(container) {
	try{
		const input = container.querySelector('.ampVal')
		oscIndex = container.id.split("-")[1]
		oscs[oscIndex].volEquation = input.value
		oscs[oscIndex].volFunction = generateFunction(oscs[oscIndex].volEquation)
		container.querySelector('.pitch').style.backgroundColor = 'black'
	} catch (e){
		container.querySelector('.ampVal').style.backgroundColor = 'red'
		console.error(e)
	}
}

const changeNoteEquation = function(container){
	try {
		const input = container
		noteEquationValue = input.value
		note = eval(noteEquationValue)
		container.style.backgroundColor = 'black'
	} catch (e){
		container.style.backgroundColor = 'red'
	}
}

function updateFreqGraph(history, oscIndex){
    const minVal = Math.min(...history)
    const maxVal = Math.max(...history)
	let canvas = oscs[oscIndex].freqCanvas 
	let ctx = canvas.getContext('2d')
	ctx.clearRect(0, 0, canvas.width, canvas.height)
// set stroke to blue
    ctx.strokeStyle = 'blue'
	ctx.beginPath()
	ctx.moveTo(0, canvas.height - (history[0] - minVal) / (maxVal - minVal) * canvas.height || 0)

	for ( i in history ){
		ctx.lineTo(i, canvas.height - (history[i] - minVal) / (maxVal - minVal) * canvas.height || 0)
	}
	ctx.stroke()
}

// pitch.addEventListener('input', () => changePitch(pitch.value))
