var storage = (function () {
	return {
		store: function (key, val) {
			localStorage.setItem(key, val);
		},
		get: function (key, def) {
			return localStorage[key] || def || null;
		}
	};
})();

var keyboard = (function () {
	function charFromEvent(e) {
		return String.fromCharCode(e.which).toLowerCase();
	}
	var layoutNotes = {
		keydown: function (e) {
			var code = e.which;
			// less than A or bigger than G
			if (code < 65 || code > 71) return;

			var letter = charFromEvent(e);
			if (e.shiftKey) letter += '#';
			levels.guess(letter);
		},
		draw: function () {
			$.each('abcdefg'.split(''), function (i, letter) {
				$('#' + letter + ' div').html(letter);
				$('#' + letter + 'sharp div').html(letter.toUpperCase());
			});
		},
		name: function () {
			return 'notes';
		}
	};
	var layoutFakeKeyboard = (function () {
		var map = {
			'a': 'c',
			'w': 'c#',
			's': 'd',
			'e': 'd#',
			'd': 'e',
			'f': 'f',
			't': 'f#',
			'g': 'g',
			'y': 'g#',
			'h': 'a',
			'u': 'a#',
			'j': 'b'
		};
		return {
			keydown: function (e) {
				var letter = charFromEvent(e);
				if (map[letter]) levels.guess(map[letter]);
			},
			draw: function () {
				for (var key in map) {
					var note = map[key];
					note = note.replace('#', 'sharp');
					$('#' + note + ' div').html(key);
				}
			},
			name: function () {
				return 'fake';
			}
		};
	})();

	var current = storage.get('layout', layoutFakeKeyboard.name()) == layoutFakeKeyboard.name()
									? layoutFakeKeyboard
									: layoutNotes;

	return {
		swap: function () {
			current = current === layoutNotes ? layoutFakeKeyboard : layoutNotes;
			current.draw();
			storage.store('layout', current.name());
		},
		keydown: function (e) {
			current.keydown(e);
		},
		draw: function () {
			current.draw();
		}
	};
})();
