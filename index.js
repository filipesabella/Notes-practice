Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};

$(function () {
	$(document).keyup(function (e) {
		if (e.which == 39) { // right arrow
			levels.next();
		} if (e.which == 37) { // left arrow
			levels.previous();
		} else if (e.which == 13) { // enter
			levels.restart();
		} else {
			var letter = String.fromCharCode(e.which).toLowerCase();
			letter && levels.guess(letter);
		}
	});

	$('.note').click(function () {
		var letter = this.id.toLowerCase();
		levels.guess(letter);
	});


	levels.start();
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

	var note = levels.currentNote().toDraw();
	var notesToDraw = [new Vex.Flow.StaveNote({keys: [note], duration: 'q'})];
	Vex.Flow.Formatter.FormatAndDraw(ctx, stave, notesToDraw);
}

var notes = (function () {
	return {
		create: function (note, octave) {
			function highlight(color) {
				$('#' + note).effect('highlight', {color: color});
			}

			return {
				// vexflow notation
				toDraw: function() { return note + '/' + octave; },
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
	function createLevel(difficulty, availableNotes) {
		var MAX_GUESSES = 3;

		var currentNote = availableNotes.random();
		var guesses = 0;
		var winCount = 0;
		var frozen = true;
		var reinforcing = false;
		function win() {
			currentNote.win();

			// so it doesn't repeat the last note
			var old = currentNote;
			while ((currentNote = availableNotes.random()) == old);

			if (!reinforcing) winCount++;

			reinforcing = false;
		}
		function fail() {
			reinforcing = true;
			currentNote.fail();
		}

		function end() {
			frozen = true;

			var info = 'You got ' + winCount + ' out of ' + MAX_GUESSES + ' notes right.' +
						'<br/>Press right arrow for the next level or enter to replay.';

			$('#game-info').show().html(info);
		}
		return {
			guess: function (letter) {
				if (frozen) return;

				var gotRight = currentNote.matches(letter);
				gotRight ? win() : fail();

				if (!reinforcing) guesses++;

				if (guesses == MAX_GUESSES && !reinforcing) {
					end();
				} else {
					draw();
				}
			},
			currentNote: function () {
				return currentNote;
			},
			start: function () {
				frozen = false;
				guesses = 0;
				winCount = 0;	
			},
			toDraw: function () {
				return difficulty;
			}
		}
	}

	var available = [
		createLevel(1, [
			notes.create('a', 4),
			notes.create('b', 4),
			notes.create('c', 4),
			notes.create('d', 4),
			notes.create('e', 4),
			notes.create('f', 4),
			notes.create('g', 4)
		]),
		createLevel(2, [
			notes.create('a', 3),
			notes.create('a', 4),
			notes.create('b', 3),
			notes.create('b', 4),
			notes.create('c', 4),
			notes.create('d', 4),
			notes.create('e', 4),
			notes.create('f', 3),
			notes.create('f', 4),
			notes.create('g', 3),
			notes.create('g', 4)
		])
	];

	var currentLevel;
	var currentLevelIndex;
	
	function start(levelIndex) {
		currentLevelIndex = 0;
		currentLevel = available[levelIndex];

		currentLevel.start();

		draw();

		$('#level-info').html('Level ' + currentLevel.toDraw());
		$('#game-info').fadeOut();
	}
	return {
		start: function () {
			start(0);
		},
		restart: function () {
			start(currentLevelIndex);
		},
		next: function () {
			currentLevelIndex < available.length - 1 && start(currentLevelIndex + 1);	
		},
		previous: function () {
			currentLevelIndex > 0 && start(currentLevelIndex - 1);
		},
		guess: function (letter) {
			currentLevel.guess(letter);
		},
		currentNote: function () {
			return currentLevel.currentNote();
		}
	}
})();

function range(min, max) {
	return {
		random: function() {
			return Math.floor(Math.random() * (max - min + 1) + min);
		}
	}
}