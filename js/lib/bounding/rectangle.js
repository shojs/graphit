(function(window, graphit, console, undefined) {

	var Cobject = graphit.import('lib/object');
	
	/**
	 * Constructor / Module
	 */
	function Module(options) {
		options = options || {};
		options.className = 'Module';
		options.label = 'Module';
		options.position = options.position || new Cpoint({
			x : 0,
			y : 0
		});
		options.width = options.width || 0;
		options.height = options.height || 0;
		Cobject.call(this, options, [
				'position', 'width', 'height'
		]);
	}

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * Method
	 */
	Module.prototype.add_point = function(point) {
		var x = point.x - this.position.x;
		if (x > this.width) {
			this.width = x;
		}
		var y = point.y - this.position.y;
		if (y > this.height) {
			this.height = y;
		}
		console.log('Bounding', this);
	};
	
	graphit.export('lib/bounding/rectangle', Module);

})(window, graphit, console);
