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
		}
	}
})();

function createLevel(difficulty, clef, availableNotes, keySignatures) {
	var MAX_GUESSES = 10;
	keySignatures = keySignatures || [createKeySignature('', [])];

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

		currentKeySignature = keySignatures.random();
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
			if (shouldEndLevel) {
				end();
			} else {
				draw(clef, currentNote, currentKeySignature);
			}
		},
		currentNote: function () {
			return currentNote;
		},
		currentKeySignature: function () {
			return keySignatures.random();
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

	var keySignatures = [
		createKeySignature('G', ['F']),
		createKeySignature('D', ['C', 'F']),
		createKeySignature('A', ['C', 'F', 'G']),
		createKeySignature('E', ['C', 'D', 'F', 'G'])];
	return [createLevel(1, 'treble', one),
			createLevel(2, 'treble', two),
			createLevel(3, 'treble', three),
			createLevel(4, 'bass', onef),
			createLevel(5, 'bass', twof),
			createLevel(6, 'bass', threef),
			createLevel(7, 'treble', two, keySignatures),
			createLevel(8, 'treble', three, keySignatures),
			createLevel(9, 'bass', twof, keySignatures),
			createLevel(10, 'bass', threef, keySignatures),];
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