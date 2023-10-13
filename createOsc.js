function newDefaultOsc(){
    createOsc(waveforms[3], 'note*(1+floor(t*8)%2)',	0.0,"amp["+oscs.length+"]*(1+floor(t*2)%2)")
    oscs[oscs.length - 1].osc.start()

}
function createOsc(wave, freqEquation, gain, volEquation){
	let volNode = audioCtx.createGain()
	let oscNode = {
		osc:			audioCtx.createOscillator(), 
		vol:			volNode,
		volSlider:		gain,
		freqText:		freqEquation, 
		freqFunction:	generateNoteFunction(freqEquation),
		volEquation: 	volEquation,
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
		class: 'ampVal',
 		type: 'text',
		value: oscs[oscs.length-1].volEquation
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
	oscContainer.appendChild(oscAmpVal)
	oscAmpVal.addEventListener('input', () => changeOscAmpVal(oscContainer))
	
	
	oscContainer.appendChild(oscType)
	oscType.addEventListener('input', () => changeOscType(oscContainer))
	
	oscContainer.appendChild(oscPitch)
	oscPitch.addEventListener('input', () => changeOscPitch(oscContainer))

	oscPitchVal.innerText = oscs[oscs.length-1].osc.frequency.value
	oscContainer.appendChild(oscPitchVal)
	document.getElementById('oscControls').appendChild(oscContainer)
}