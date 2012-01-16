var notes = (function () {
	return {
		create: function (letter, octave) {
			function highlight(color) {
				$('#' + letter.replace('#', 'sharp')).effect('highlight', {color: color});
			}

			return {
				// vexflow notation
				toDraw: function() { return letter + '/' + octave; },
				matches: function (anotherLetter) {
					return letter.toLowerCase() == anotherLetter;
				},
				letter: function () {
					return letter;	
				},
				sharp: function () {
					return notes.create(letter + '#', octave);
				},
				win: function () {
					highlight('green');
				},
				fail: function () {
					highlight('red');
				}
			}
		}
	}
})();