var levels = (function () {
	var currentLevel;
	var currentLevelIndex;
	
	function start(levelIndex) {
		currentLevelIndex = levelIndex;
		currentLevel = availableLevels[levelIndex];

		currentLevel.start();

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
		},
		create: function (difficulty, clef, availableNotes, keySignatures) {
			var MAX_GUESSES = 10;
			keySignatures = keySignatures || [createKeySignature('', [])];

			var currentKeySignature;
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

				currentNote = currentKeySignature.modify(currentNote);

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

					var shouldEndLevel = guesses == MAX_GUESSES && !reinforcing;
					shouldEndLevel
						? end()
						: draw(clef, currentNote, currentKeySignature);
				},
				start: function () {
					frozen = false;
					guesses = 0;
					winCount = 0;

					currentKeySignature = keySignatures.random();
					currentNote = currentKeySignature.modify(availableNotes.random());

					draw(clef, currentNote, currentKeySignature);

					startTime = new Date().getTime();
				},
				toDraw: function () {
					return difficulty;
				}
			};

			return level;
		}
	}
})();

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
		notes.create('a', 2),
		notes.create('b', 2),
		notes.create('c', 3),
		notes.create('c', 4),
		notes.create('d', 3),
		notes.create('d', 4),
		notes.create('e', 3),
		notes.create('f', 3),
		notes.create('g', 2)];
	var twof = onef.concat([
		notes.create('a', 3),
		notes.create('b', 3),
		notes.create('c', 2),
		notes.create('d', 2),
		notes.create('e', 2),
		notes.create('f', 2),
		notes.create('g', 3)]);
	var threef = twof.concat([
		notes.create('a', 1),
		notes.create('b', 1),
		notes.create('f', 1),
		notes.create('g', 1),
		notes.create('e', 4)]);

	var keySignatures = [
		createKeySignature('G', ['F']),
		createKeySignature('D', ['C', 'F']),
		createKeySignature('A', ['C', 'F', 'G']),
		createKeySignature('E', ['C', 'D', 'F', 'G'])];
	return [levels.create(1, 'treble', one),
			levels.create(2, 'treble', two),
			levels.create(3, 'treble', three),
			levels.create(4, 'bass', onef),
			levels.create(5, 'bass', twof),
			levels.create(6, 'bass', threef),
			levels.create(7, 'treble', two, keySignatures),
			levels.create(8, 'treble', three, keySignatures),
			levels.create(9, 'bass', twof, keySignatures),
			levels.create(10, 'bass', threef, keySignatures),];
})();

function createKeySignature(signatureKey, notesAffected) {
	return {
		modify: function (anotherNote) {
			var anotherLetter = anotherNote.letter().toUpperCase();
			return notesAffected.contains(anotherLetter)
				? anotherNote.sharp()
				: anotherNote;
		},
		addToStave: function (stave) {
			signatureKey &&  stave.addKeySignature(signatureKey);
		}
	}
}