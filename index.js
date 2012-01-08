$(function () {
	$(document).keypress(function (e) {
		var letter = String.fromCharCode(e.which).toLowerCase();
		guessed(letter);
	});

	$('.note').click(function () {
		var letter = this.id.toLowerCase();
		guessed(letter);
	});


	levels.start();
	notes.next();
	draw();
});

function draw() {
	$('#note').html(notes.current());
}

function guessed(letter) {
	function win() {
		notes.next();
	}
	function fail() {
	}
	
	notes.current().toLowerCase() == letter
		? win()
		: fail();
	draw();
}

var levels = (function () {
	var current;
	return {
		one: (function () {
			return {
				octaves: function () {
					return 'CDEFGAB'.split('');
				}
			}
		})(),
		current: function () {
			return current;
		},
		start: function () {
			current = levels.one;
		}
	}
})();


var notes = (function () {
	var current;
	return {
		current: function () {
			return current;
		},
		next: function () {
			current = levels.current().octaves().random();
			return current;
		}
	}
})();

Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};
