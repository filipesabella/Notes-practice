var notes = (function () {
	return {
		create: function (letter, octave) {
			function highlight(color) {
				$('#' + letter.replace('#', 'sharp')).effect('highlight', {color: color});
			}

			function playSound() {
				var sound = letter.replace('#', 'sharp') + (octave - 1);
				var id = 'sound-' + sound;

				if (!sounds[sound]) return;

				if ($('#' + id).length == 0) {
					var audio = $('<audio>').attr('id', id);
					var source = $('<source>').attr('src', 'data:audio/mp3;base64,' + sounds[sound]);
					audio.append(source);
					$(document.body).append(audio);
				}

				var audio = $('#' + id)[0];
				audio.currentTime != 0 && (audio.currentTime = 0);
				audio.play();
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

					playSound();
				},
				fail: function () {
					highlight('red');
				}
			};
		}
	};
})();
