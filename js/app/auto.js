/**
 * Module app/auto
 * graphit[js/app/auto.js]
 * sho / 14 déc. 2012 / 07:24:57
 */
(function(window, graphit, console, undefined) {

	'use strict';

	var DEBUG = graphit.debug;
	var modulePath = 'app/auto';

	var Cobject = graphit.import('lib/object');
	var Ccolor = graphit.import('lib/color');
	
	
	/**
	 * graphit[js/app/auto.js]
	 * sho / 14 déc. 2012 / 07:24:57
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
	 * Test
	 */
	Module.prototype.__test = function() {
		;
	};

	/* Export */
	graphit.export(modulePath, Module);

})(window, graphit, console);