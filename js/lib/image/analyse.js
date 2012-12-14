(function(window, graphit, console, undefined) {

	'use strict';

	var Cobject = graphit.import('lib/object');
	var Ccolor = graphit.import('lib/color');
	/**
	 * Class Module graphit[js/lib/image/Module.js] sho /
	 * 09:26:59 / 4 déc. 2012
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	/**
	 * Class Module [jsgraph] sho
	 */
	function Module(options) {
		Cardinal = {
			nw : 7,
			n : 0,
			ne : 1,
			w : 6,
			e : 2,
			sw : 5,
			s : 4,
			se : 3
		};
		options = options || {};
		options.className = "Module";
		options.label = "Module";
		Cobject.call(this, options, [
				'source_points', 'image_data'
		]);
	}

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 *
	 */
	Module.prototype.get_cardinal_pixel = function(imgData, spixel,
			pool) {
		var x = spixel.x;
		var y = spixel.y;
		var w = imgData.width;
		var h = imgData.height;
		var max = w * h;
		var a = [];
		var index;
		var pushme = function(x, y) {
			var index = y * w + x;
			if (pool[index] != undefined) {
				return;
			}
			if (index >= 0 && index < max) {
				a.push({
					x : x,
					y : y,
					index : index
				});
			}
		};
		/* North */
		pushme(x, y - 1); // N
		pushme(x + 1, y - 1); // NE
		pushme(x + 1, y); // E
		pushme(x + 1, y + 1); // SE
		pushme(x, y + 1); // S
		pushme(x - 1, y + 1); // SW
		pushme(x - 1, y); // W
		pushme(x - 1, y - 1); // NW
		return a;
	};
	/**
	 *
	 */
	Module.prototype.select_adjacent_pixel = function(imgData, spixel,
			pool, callback) {
		var pixels = this.get_cardinal_pixel(imgData, spixel, pool);
		for ( var i = 0; i < pixels.length; i++) {
			callback.call(this, pixels[i]);
		}
	};

	/**
	 *
	 */
	Module.prototype.adjacent_by_color = function(imgData, spixel) {
		var pool = [];
		var check = [];
		var totalPixel = imgData.width * imgData.height;
		for ( var i = 0; i < totalPixel; i++) {
			pool[i] = null;
		}
		index = spixel.y * imgData.width + spixel.x;
		check.push({
			x : spixel.x,
			y : spixel.y,
			index : index
		});
		var same_color = function(imgData, colorA, point) {
			var colorB = new Ccolor().from_pixel(imgData, point);
			if (colorA.equal(colorB, [
					'r', 'g', 'b'
			])) {
				return true;
			}
			return false;
		};
		var totalSame = 0;
		var totalChecked = 0;
		var scolor = new Ccolor().from_pixel(imgData, spixel);
		while (check.length > 0) {
			var cpoint = check.pop();
			totalChecked++;
			this.select_adjacent_pixel(imgData, cpoint, pool, function(apixel) {
				if (same_color(imgData, scolor, apixel)) {
					totalSame++;
					pool[apixel.index] = 1;
					check.push(apixel);
				} else {
					pool[apixel.index] = 0;
				}
			});
		}
		return pool;
	};

	graphit.export('image/analyse', Module);
	
})(window, graphit, console);
