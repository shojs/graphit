(function(window, graphit, console, undefined) {

	'use strict';
	
	var modulePath = 'lib/transform/2d';
	
	var Cobject = graphit.import('lib/object');
	var Cmatrix33 = graphit.import('lib/math/matrix33');
	var Cvector2d = graphit.import('lib/math/vector2d');
	
	/**
	 * @constructor Class Module 17:56:06 / 4 déc. 2012 [jsgraph] sho
	 */
	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.label = modulePath;
		Cobject.call(this, options, []);
		this.matrix = new Cmatrix33();
		this.matrix.identity();
		this.position = new Cvector2d();
		this.u = new Cvector2d();
		this.v = new Cvector2d();
		// this.bounding = new Cbounding_rectangle({parent: this});
	}

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 *
	 */
	Module.prototype.translate = function(point) {
		if (!('x' in point) || !'y' in point) {
			this.exception('camel_camouflage_failed');
		}
		this.matrix.translate(point);
	};

	/**
	 *
	 */
	Module.prototype.rotate = function(point) {
		if (!('x' in point) || !'y' in point) {
			this.exception('camel_camouflage_failed');
		}
		this.matrix.translate(point);
	};

	/**
	 *
	 */
	Module.prototype.translate = function(angle) {
		if (!angle) {
			this.exception('camel_camouflage_failed');
		}
		this.matrix.translate(point);
	};

	graphit.export(modulePath, Module);

})(window, graphit, console);
