(function(window, graphit, console, undefined) {

	var modulePath = 'lib/math/matrix33';

	/**
	 * @constructor Class Module 22:34:30 / 30 nov. 2012 [jsgraph] sho
	 */
	var Module = function(data) {
		this.className = modulePath;
		m11 = 0;
		m12 = 1;
		m13 = 2;
		m21 = 3;
		m22 = 4;
		m23 = 5;
		m31 = 6;
		m32 = 7;
		m33 = 8;
		this.data = [];
		data = (data != undefined) ? data : [
				1, 0, 0, 0, 1, 0, 0, 0, 1
		];
		this.set(data);
	}

	/**
	 *
	 */
	Module.prototype.init = function(value) {

	};

	/**
	 *
	 */
	Module.prototype.clone = function() {
		var m = new Module(this);
		return m;
	};

	/**
	 *
	 */
	Module.prototype._is_valid_array = function(a) {
		if (a.length == 9) {
			return true;
		}
		return false;
	};

	/**
	 *
	 */
	Module.prototype.translate = function(point) {
		var mt = new Module([
				1, 0, 0, 0, 1, 0, point.x, point.y, 1
		]);
		this.mul(mt);
		return this;
	};

	Module.prototype.scale = function(point) {
		var mt = new Module([
				point.x, 0, 0, 0, point.y, 0, 0, 0, 1
		]);
		this.mul(mt);
		return this;
	};

	Module.prototype.rotate = function(angle) {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);
		var mt = new Module([
				cos, sin, 0, -sin, cos, 0, 0, 0, 1
		]);
		this.mul(mt);
		return this;
	};

	/**
	 *
	 */
	Module.prototype.set = function(thing) {
		console.log(thing);
		if (thing == undefined) {
			return this;
		}
		if (thing instanceof Array) {
			if (!this._is_valid_array(thing)) {
				throw 'matrix33_invalid_array';
			}
			for ( var i = 0; i <= m33; i++) {
				this.data[i] = thing[i];
			}
		} else if (thing instanceof Module) {
			for ( var i = 0; i <= m33; i++) {
				this.data[i] = thing.data[i];
			}
		} else if (typeof thing == 'number') {
			var value = parseFloat(thing);
			for ( var i = 0; i <= m33; i++) {
				this.data[i] = value;
			}
		} else {
			throw 'matrix33_invalid_value';
		}
		return this;
	};

	/**
	 *
	 */
	Module.prototype.add = function(thing) {
		if (!thing) { // Zero do nothing
			return this;
		}
		if (thing instanceof Array) {
			if (!this._is_valid_array(thing)) {
				throw 'matrix33_invalid_array';
			}
			for ( var i = 0; i <= m33; i++) {
				this.data[i] += thing[i];
			}
		} else if (thing instanceof Module) {
			for ( var i = 0; i <= m33; i++) {
				this.data[i] += thing.data[i];
			}
		} else if (typeof thing == 'number') {
			var value = parseFloat(thing);
			for ( var i = 0; i <= m33; i++) {
				this.data[i] += value;
			}
		} else {
			throw 'matrix33_invalid_value';
		}
		return this;
	};

	/**
	 * 
	 */
	Module.prototype.round = function() {
		for ( var i = 0; i <= m33; i++) {
			this.data[i] = Math.round(this.data[i]);
		}
		return this;
	};

	/**
	 * 
	 */
	Module.prototype.floor = function() {
		for ( var i = 0; i <= m33; i++) {
			this.data[i] = Math.floor(this.data[i]);
		}
		return this;
	};

	/**
	 *
	 */
	Module.prototype.random = function(value) {
		value = value || 1;
		for ( var i = 0; i <= m33; i++) {
			this.data[i] = Math.random(value);
		}
		return this;
	};

	/**
	 *
	 */
	Module.prototype.identity = function() {
		this.data = [
				1, 0, 0, 0, 1, 0, 0, 0, 1
		];
		return this;
	};

	Module.prototype.mul = function(thing) {
		console.log(thing);
		if (!thing) { // Zero do nothing
			return this;
		}
		if (thing instanceof Module
				|| (thing instanceof Array && thing.length == 9)) {
			var a = this.data;
			var m = [];
			var b = null;
			if (thing instanceof Module) {
				b = thing.data;
			} else {
				b = thing;
			}
			console.log(a, b);
			// First row
			m[m11] = a[m11] * b[m11] + a[m12] * b[m21] + a[m13] * b[m31];
			m[m12] = a[m11] * b[m12] + a[m12] * b[m22] + a[m13] * b[m32];
			m[m13] = a[m11] * b[m13] + a[m12] * b[m23] + a[m13] * b[m33];
			// Second row
			m[m21] = a[m21] * b[m11] + a[m22] * b[m21] + a[m23] * b[m31];
			m[m22] = a[m21] * b[m12] + a[m22] * b[m22] + a[m23] * b[m32];
			m[m23] = a[m21] * b[m13] + a[m22] * b[m23] + a[m23] * b[m33];
			// Third row
			m[m31] = a[m31] * b[m11] + a[m32] * b[m21] + a[m33] * b[m31];
			m[m32] = a[m31] * b[m12] + a[m32] * b[m22] + a[m33] * b[m32];
			m[m33] = a[m31] * b[m13] + a[m32] * b[m23] + a[m33] * b[m33];
			console.log('m', m);
			this.data = m;
		} else if (typeof thing == 'number') {
			console.log(typeof thing);
			var value = parseFloat(thing);
			for ( var i = 0; i <= m33; i++) {
				this.data[i] *= value;
			}
		} else {
			throw 'matrix33_invalid_value';
		}
		return this;
	};

	Module.prototype.minor = function() {
		var m = [];
		var a = this.data;
		m[m11] = a[m22] * a[m33] - a[m32] * a[m23];
		m[m12] = a[m21] * a[m33] - a[m31] * a[m23];
		m[m13] = a[m21] * a[m32] - a[m31] * a[m22];
		m[m21] = a[m12] * a[m33] - a[m32] * a[m13];
		m[m22] = a[m11] * a[m33] - a[m31] * a[m13];
		m[m23] = a[m11] * a[m32] - a[m31] * a[m12];
		m[m31] = a[m12] * a[m23] - a[m22] * a[m13];
		m[m32] = a[m11] * a[m23] - a[m21] * a[m13];
		m[m33] = a[m11] * a[m22] - a[m21] * a[m12];
		this.data = m;
		return this;
	};

	/**
	 *
	 */
	Module.prototype.to_s = function(options) {
		var nl = "\n";
		var sp = ' ';
		if (options && 'format' in options && options['format'] == 'html') {
			nl = "<br>\n";
		}
		var str = "Module" + nl + sp;
		for ( var i = 0; i <= m33; i++) {
			str += this.data[i] + ',';
			if ((i + 1) % 3 == 0) {
				str += nl + sp;
			}
		}
		return str;
	};

	graphit.export('lib/math/matrix33', Module);
	
})(window, graphit, console);
