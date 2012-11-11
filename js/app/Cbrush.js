//function Cbrush(options) {
//	Cobject.call(this);
//	this.options = {};
//	if (options) {
//		this.set_options(options);
//	}
//}
//
//Cbrush.prototype = Object.create(Cobject.prototype);
//Cbrush.prototype.constructor = new Cobject();
//
//Cbrush.prototype.set_options = function(options) {
//	if (options == this.options) {
//		console.warn('Same object don\'t replace');
//		return true;
//	}
//	this.options = options;
//	this.set_canvas();
//};
//
//Cbrush.prototype.set_canvas = function() {
//	this.cCanvas = null;
//};
//
//function Cbrush_circle(options) {
//	Cbrush.call(this, options);
//}
//
//Cbrush_circle.prototype = Object.create(Cbrush.prototype);
//Cbrush_circle.prototype.constructor = new Cbrush();
//
//var circle_options = {
//		size: 10,
//};
//var circle_options2 = {
//		size: 15,
//};
//
//var cBrush_circle = new Cbrush_circle(circle_options);
//cBrush_circle.set_options(circle_options);


