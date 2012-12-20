/**
 * Module lib/context2d
 * graphit[js/lib/context2d.js]
 * sho / 17 déc. 2012 / 01:16:08
 */
(function(window, project, console, undefined) {

	'use strict';

	var DEBUG = graphit.debug;
	var modulePath = 'lib/context2d';

//	var Cobject = graphit.import('lib/object');

	/**
	 * graphit[js/lib/context2d.js]
	 * sho / 17 déc. 2012 / 01:16:08
	 * @constructor
	 * @param options {Hash} Options hash
	 */
	var Module = function(options) {
		options = options || {};
		options['className'] = modulePath;
		options['label'] = modulePath;
//		Cobject.call(this, options, []);
	};

	/* Inheritance */
//	Module.prototype = Object.create(Cobject.prototype);
//	Module.prototype.constructor = new Cobject();

	/**
	 * Test
	 */
	Module.prototype.__test = function() {
		var Context = new (project.import('lib/canvas'))();
		var Ccanvas = project.import()
		console.log('Testing some drawing function');
		var canvas = new Ccanvas({width: 640, height: 480});
		
	};

	/* Export */
	project.export(modulePath, Module);

})(window, project, console);