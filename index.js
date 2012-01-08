Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};

$(function () {
	$(document).keypress(function (e) {
		var letter = String.fromCharCode(e.which).toLowerCase();
		levels.guess(letter);
	});

	$('.note').click(function () {
		var letter = this.id.toLowerCase();
		levels.guess(letter);
	});


	levels.start();
	draw();
});

function draw() {
	var canvas = $('#canvas')[0];

	canvas.width = canvas.width; // clear canvas
	var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

	var ctx = renderer.getContext();
	var stave = new Vex.Flow.Stave(0, 10, 100);

	stave.addClef('treble');
	//stave.addClef('bass');
	stave.setContext(ctx).draw();

	var note = levels.currentNote().note();
	var octave = levels.currentNote().octave();
	var notesToDraw = [new Vex.Flow.StaveNote({keys: [note + '/' + octave], duration: 'q'})];
	Vex.Flow.Formatter.FormatAndDraw(ctx, stave, notesToDraw);
}

var notes = (function () {
	return {
		create: function (note, minOctave, maxOctave) {
			maxOctave = maxOctave || minOctave;

			function highlight(color) {
				$('#' + note).effect('highlight', {color: color});
			}

			return {
				note: function() { return note; },
				octave: function () { return range(minOctave, maxOctave).random(); },
				matches: function (letter) {
					return note.toLowerCase() == letter
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

var levels = (function () {
	function createLevel(availableNotes) {
		var currentNote = availableNotes.random();

		function win () {
			currentNote.win();

			var old = currentNote;
			// so it doesn't repeat
			while ((currentNote = availableNotes.random()) == old);
		}
		function fail () {
			currentNote.fail();
		}
		return {
			guess: function (letter) {
				currentNote.matches(letter) ? win() : fail();
				draw();
			},
			currentNote: function () {
				return currentNote;
			}
		}
	}

	var available = [
		createLevel([
			notes.create('a', 4),
			notes.create('b', 4),
			notes.create('c', 4),
			notes.create('d', 4),
			notes.create('e', 4),
			notes.create('f', 4),
			notes.create('g', 4)
		])
	];

	var currentLevel;
	return {
		start: function () {
			currentLevel = available[0];
		},
		guess: function (letter) {
			currentLevel.guess(letter);
		},
		currentNote: function () {
			return currentLevel.currentNote();
		}
	}
})();


function random(from, to) { return Math.floor(Math.random() * (to - from + 1) + from); }
function range(min, max) {
	return {
		random: function() {
			return random(min, max);
		}
	}
}