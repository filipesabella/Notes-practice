Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};

$(function () {
	$(document).keydown(function (e) {
		switch (e.which) {
			case 39: // right arrow
				levels.next();
				break;
			case 37: // left arrow
				levels.previous();
				break;
			case 13: // return
				levels.restart();
				break;
			default:
				var letter = String.fromCharCode(e.which).toLowerCase();
				letter.match(/[a-zA-Z]/) && levels.guess(letter);
		}
	});

	$('.note').click(function () {
		var letter = this.id.toLowerCase();
		levels.guess(letter);
	});


	levels.start();
});

function draw(clef, note) {
	var canvas = $('#canvas')[0];

	canvas.width = canvas.width; // clear canvas
	var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

	var ctx = renderer.getContext();
	var stave = new Vex.Flow.Stave(0, 10, 100);

	stave.addClef(clef);
	stave.setContext(ctx).draw();

	var note = note.toDraw();
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
	var currentLevel;
	var currentLevelIndex;
	
	function start(levelIndex) {
		currentLevelIndex = levelIndex;
		currentLevel = availableLevels[levelIndex];

		currentLevel.start();

		draw(currentLevel.clef(), currentLevel.currentNote());

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
			currentLevelIndex < availableLevels.length - 1 && start(currentLevelIndex + 1);	
		},
		previous: function () {
			currentLevelIndex > 0 && start(currentLevelIndex - 1);
		},
		guess: function (letter) {
			currentLevel.guess(letter);
		}
	}
})();

function createLevel(difficulty, clef, availableNotes) {
	var MAX_GUESSES = 10;

	var currentNote = availableNotes.random();
	var startTime;
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

		var time = (new Date().getTime() - startTime) / 1000;

		var info = 'You got ' + winCount + ' out of ' + MAX_GUESSES + ' notes right in ' +
					parseInt(time) + ' seconds.' +
					'<br/>Press right arrow for the next level or enter to replay.';

		$('#game-info').show().html(info);
	}
	var level = {
		guess: function (letter) {
			if (frozen) return;

			var gotRight = currentNote.matches(letter);
			gotRight ? win() : fail();

			if (!reinforcing) guesses++;

			if (guesses == MAX_GUESSES && !reinforcing) {
				end();
			} else {
				draw(clef, currentNote);
			}
		},
		currentNote: function () {
			return currentNote;
		},
		start: function () {
			frozen = false;
			guesses = 0;
			winCount = 0;

			currentNote = availableNotes.random();
			draw(clef, currentNote);

			startTime = new Date().getTime();
		},
		toDraw: function () {
			return difficulty;
		},
		clef: function () {
			return clef;
		}
	};

	return level;
}

var availableLevels = (function () {
	var one = [notes.create('a', 4),
		notes.create('b', 4),
		notes.create('c', 4),
		notes.create('d', 4),
		notes.create('e', 4),
		notes.create('f', 4),
		notes.create('g', 4)];
	var two = one.concat([
		notes.create('a', 5),
		notes.create('b', 5),
		notes.create('c', 5),
		notes.create('d', 5),
		notes.create('e', 5),
		notes.create('f', 5),
		notes.create('g', 5)]);
	var three = two.concat([
		notes.create('a', 3),
		notes.create('b', 3),
		notes.create('f', 3),
		notes.create('g', 3),
		notes.create('c', 6),
		notes.create('d', 6),
		notes.create('e', 6)]);

	var onef = [
		notes.create('a', 4),
		notes.create('b', 4),
		notes.create('c', 5),
		notes.create('c', 6),
		notes.create('d', 5),
		notes.create('d', 6),
		notes.create('e', 5),
		notes.create('f', 5),
		notes.create('g', 4)];
	var twof = one.concat([
		notes.create('a', 5),
		notes.create('b', 5),
		notes.create('c', 4),
		notes.create('d', 4),
		notes.create('e', 4),
		notes.create('f', 4),
		notes.create('g', 5)]);
	var threef = two.concat([
		notes.create('a', 3),
		notes.create('b', 3),
		notes.create('f', 3),
		notes.create('g', 3),
		notes.create('e', 6)]);

	return [createLevel(1, 'treble', one),
			createLevel(2, 'treble', two),
			createLevel(3, 'treble', three),
			createLevel(4, 'bass', onef),
			createLevel(5, 'bass', twof),
			createLevel(6, 'bass', threef)];
})();

function range(min, max) {
	return {
		random: function() {
			return Math.floor(Math.random() * (max - min + 1) + min);
		}
	}
}