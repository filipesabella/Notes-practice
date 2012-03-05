Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};
Array.prototype.contains = function (element) {
	for (var i = 0; i < this.length; i++) 
		if (this[i] == element)
			return true;
	return false;
};
function range(min, max) {
	return {
		random: function() {
			return Math.floor(Math.random() * (max - min + 1) + min);
		}
	}
}

$(function () {
	$('#controls a').click(function	() {
		keyboard.swap();
		return false;
	});

	$(document).keydown(function (e) {
		var actions = {
			39: levels.next,
			37: levels.previous,
			13: levels.restart
		}
		var key = e.which;
		actions[key] ? actions[key]() : keyboard.current().keydown(e);
	});

	$('.note').click(function () {
		var letter = this.id.toLowerCase().replace('sharp', '#');
		levels.guess(letter);
	});


	levels.start();
});

function draw(clef, note, keySignature) {
	var canvas = $('#canvas')[0];

	canvas.width = canvas.width; // clear canvas
	var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

	var ctx = renderer.getContext();

	var stave = new Vex.Flow.Stave(0, 10, 150).addClef(clef);
	keySignature.addToStave(stave);
	stave.setContext(ctx).draw();

	note = note.toDraw();
	var notesToDraw = [new Vex.Flow.StaveNote({clef: clef, keys: [note], duration: 'q'})];
	Vex.Flow.Formatter.FormatAndDraw(ctx, stave, notesToDraw);
}