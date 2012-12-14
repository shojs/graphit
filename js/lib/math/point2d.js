(function(window, graphit, console, undefined) {

	var modulePath = 'lib/math/point2d';
	/**
	 * A point in space
	 * 
	 * @param x
	 * @param y
	 * @returns
	 */
	var Module = function(pos) {
		if (pos != undefined && (!('x' in pos) || !('y' in pos))) {
			throw new Cexception_message({
				className : modulePath,
				error : 'invalid_component',
				additional : pos
			});
		}
		pos = pos || {
			x : 0,
			y : 0
		};
		Object.defineProperty(this, "x", {
			value : pos.x,
			writable : true,
			enumerable : true,
			configurable : false
		});
		Object.defineProperty(this, "y", {
			value : pos.y,
			writable : true,
			enumerable : true,
			configurable : false
		});
	};

	/**
	 * 
	 */
	Module.prototype.round = function() {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
	};

	graphit.export(modulePath, Module);
	
})(window, graphit, console);
