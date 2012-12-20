/**
 * Module app/core/object
 * graphit[js/app/core/core.js]
 * sho / 17 déc. 2012 / 04:02:57
 */
(function(window, project, console, undefined) {

	'use strict';

	var DEBUG = project.debug;
	var modulePath = 'app/core/object';

	var Cobject = project.import('lib/object');

	/**
	 * graphit[js/app/core/core.js]
	 * sho / 17 déc. 2012 / 04:02:57
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
	 * Method add_component
	 * graphit[js/app/core/object.js]
	 * sho / 17 déc. 2012 / 04:10:29
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.add_component = function(path, component) {
		var xpath = (path+'').split('/');
		var root = xpath.pop();
		console.log('root/xpath', root, xpath);
		if (xpath.length == 0) { 
			this[root] = component;
		} else {
			if (!this[root]) {
				throw('invalid_component_path__'+path+'-'+root);//,{'label':'invalid_path', 'path': path, 'root':root});
			}
			this[root].add_component(xpath.join('/'), component);
		}
	};
	
	/**
	 * Test
	 */
	Module.prototype.__test = function() {
		var M = project.import(modulePath);
		var m = new M();
	};

	/* We are exporting add_component into graphit */
	project.add_component = Module.add_component;
	
	/* Export */
	project.export(modulePath, Module);

})(window, graphit, console);