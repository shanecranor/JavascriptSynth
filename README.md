# JavascriptSynth
A (mostly) fully featured synthesizer built using the webaudio API, chceck out the live page at https://shane.cranor.org/synth !
## Current Features
- Infinite OSCs
- 4 waveforms, sin, triangle, sawtooth, square
- Custom scales based on the note equation
- Keyboard support (awsedftghujikol;') //or something like that
- Modular OSC pitch input field
  - Type in a specific frequency or use the 'note' variable to access the output of the note equation
  - t is a time based variable then increases by 1 every update cycle
  - sin(x) and cos(x) does as expected (x is in radians I think)
  - rand() will produce a random floating point number between 0 and 1
  - pitches[i] returns the pitch of the ith oscillator besides the current oscillator.
  - all operators work mostly as expected + - / * %
  - Javascript functions work like Math.tan()
  
  
## Potential Future Directions:

//easy:
- Add filters (lowpass, highpass, bandpass)
- Add distortion and other effects
  - Add effects array and allow chaining
- Add sequencer/multiple sequencers

//unknown difficulty:
- Try to reduce latency/input lag
- Midi input
- Export recorded audio
- Hook up output of osc as a variable to another osc
- Make ADSR

//Difficult
- Polyphonic synth
- Parametric EQ with cute interface
- Switch to node based interface
  - Still use text based interface, just use the input pipes as variables
  - IE an OSC block with a note and amplitude input would have two text fields and by default, the note field would contain noteIn and the amplitude field would contain volIn
  - There will be an option to add input pipes and rename them.
  -  Potentially a way to have default values for input pipes if nothing is connected to them
  -  Custom waveforms built outside of web audio api OSC object?
