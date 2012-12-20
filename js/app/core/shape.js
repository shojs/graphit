/**
 * Module app/core/shape
 * graphit[js/app/core/shape.js]
 * sho / 20 déc. 2012 / 09:58:15
 */
(function(window, project, console, undefined) {

	'use strict';

	var DEBUG = project.debug;
	var modulePath = 'app/core/shape';

	var Cobject = project.import('app/core/object');

	/**
	 * graphit[js/app/core/shape.js]
	 * sho / 20 déc. 2012 / 09:58:15
	 * @constructor
	 * @param options {Hash} Options hash
	 */
	var Module = function(options) {
		options = options || {};
		options['className'] = modulePath;
		options['label'] = modulePath;
		Cobject.call(this, options, []);
	};

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	
	/**
	 * Method circle
	 * graphit[js/app/core/shape.js]
	 * sho / 20 déc. 2012 / 10:01:04
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.circle = function(ctx, x, y, radius, startAngle, endAngle, clockwise) {
		startAngle = startAngle != undefined? startAngle: 0;
		endAngle = endAngle != undefined? endAngle:  Math.PI*2;
		clockwise = clockwise != undefined? clockwise: false;
		ctx.arc(x, y, radius, startAngle, endAngle, clockwise);
	};
	
	/**
	 * Method line
	 * graphit[js/app/core/shape.js]
	 * sho / 20 déc. 2012 / 10:17:28
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.line = function(ctx, A, B) {
		ctx.moveTo(A.x, A.y);
		ctx.lineTo(B.x, B.y);
	};
	
	
	/**
	 * Method rectangle
	 * graphit[js/app/core/shape.js]
	 * sho / 20 déc. 2012 / 12:25:21
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.rectangle = function(ctx, A, B) {
		ctx.drawRectangle(ctx, A.x, A.y, B.x, B.y);
	};
	
	/**
	 * Test
	 */
	Module.prototype.__test = function() {
		var M = project.import(modulePath);
		var m = new M();
	};
	Module.prototype['__test'] = Module.prototype.__test;

	/* Export */
	project.export(modulePath, Module);

})(window, graphit, console);