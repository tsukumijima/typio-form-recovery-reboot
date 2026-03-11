import Events from './Events';

let keyboardShortcuts = {};

var pressed = [],
	combos = []

keyboardShortcuts.on = function(keycombo, callback) {

	// Backwards compatibility
	keycombo = comoStrToArray(keycombo);

	if(keycombo.length < 2 && keycombo[0] === '') return;

	var combo = JSON.parse(JSON.stringify(keycombo)).map(key => key.toLowerCase())
	combos.push({
		keys: combo,
		callback: callback
	})
}

keyboardShortcuts.printableKey = function(keycombo) {

	// Backwards compatibility
	keycombo = comoStrToArray(keycombo);

	if(keycombo.length === 1 && keycombo[0] === '') {
		return '<span class="key disabled">disabled</span>'
	} else {
		return '<span class="key">' + keycombo.join('</span> <span class="key">') + '</span>';
	}
}

function comoStrToArray(keycombo) {
	if(typeof keycombo === 'string') {
		keycombo = keycombo.replace(/[^a-z+]/gi, '').split('+');
	}

	return keycombo;
}


function checkForCombo(event) {

	// Loop through all key combos
	comboLoop:
	for(var combo of combos) {

		// Ignore if not the same number of keys pressed
		if(combo.keys.length !== pressed.length) {
			continue;
		}

		// Abort if not all keys match
		for(var key of combo.keys) {
			if(!pressed.includes(key)) {
				continue comboLoop;
			}
		}

		// It's a match!
		combo.callback(event)

		// Do not return; allow multiple identical combos (like Escape)
		// return true
	}
}

Events.on('keydown', function(e) {
	if(e.key === undefined) return;

	// Normalize non-alphabetic key names to match the stored combo format
	var lowcase = (e.key === ' ' ? 'Space' : e.key).toLowerCase();

	if(pressed.indexOf(lowcase) === -1) {
		pressed.push(lowcase);
	}

	checkForCombo(e);
})

Events.on('keyup', function(e) {
	pressed = []

	// var pi = pressed.indexOf(e.key)
	// if(pi > 0) {
	// 	pressed = pressed.splice(pi, 0)
	// 	console.log('keyup', pressed)
	// }
})

export default keyboardShortcuts;