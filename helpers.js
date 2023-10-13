
const keyMap = new Object()
const keyNoteMap = {
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

const waveforms = {
	0: 'sine',
	1: 'triangle',
	2: 'sawtooth',
	3: 'square'
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

function generateNoteFunction(string) {
    return new Function("note", 'return ' + string)
}
function generateFunction(string) {
    return new Function('return ' + string)
}
