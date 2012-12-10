/**
 * Constructor / Cbounding_rectangle
 */
function Cbounding_rectangle(options) {
	options = options || {};
	options.className = 'Cbounding_rectangle';
	options.label = 'Cbounding_rectangle';
	options.position = options.position || new Cpoint({x: 0, y: 0});
	options.width = options.width || 0;
	options.height = options.height || 0;
	Cobject.call(this, options, ['position', 'width', 'height']);
}

/* Inheritance */
Cbounding_rectangle.prototype = Object.create(Cobject.prototype);
Cbounding_rectangle.prototype.constructor = new Cobject();

/**
 * Method
 */
Cbounding_rectangle.prototype.add_point = function(point) {
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