(function(window, graphit, console, undefined) {

	var modulePath = 'lib/math/vector2d';
	
	var Cpoint2d = graphit.import('lib/math/point2d');
	
	/**
	 * A 2d vector
	 * @param {x, y} Position must be an object with x and y properties
	 */
	function Module(pos) {
		this.className = modulePath;
		Cpoint2d.call(this, pos);
	}

	Module.prototype = Object.create(Cpoint2d.prototype);
	Module.prototype.constructor = new Cpoint2d();

	Module.prototype.magnitude = function() {
		if (this.x == 0 && this.y == 0) return 0;
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	};

	Module.prototype.normalize = function() {
		var m = this.magnitude();
		if (m == 0) return this;
		this.x /= m;
		this.y /= m;
		return this;
	};

	Module.prototype.from_point = function(a, b) {
		this.x = b.x - a.x;
		this.y = b.y - a.y;
		return this;
	};

	Module.prototype.smul = function(s) {
		this.x *= s;
		this.y *= s;
		return this;
	};

	Module.prototype.vadd = function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	};

	Module.prototype.clone = function() {
		return new Module(this);
	};

	graphit.export(modulePath, Module);
	
})(window, graphit, console);
