(function(window, graphit, console, undefined) {
	
	'use strict';
	
	var modulePath = 'lib/icon';
	
	var Cimage = graphit.import('lib/image');
	
	/**
	 * @constructor
	 * @param options
	 */
	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.size = options.size || 22;
		options.type = options.type || 'gimp';
		options.format = options.format || 'png';
		options.label = options.label || 'icon';
		options.path = options.path ? '/' + options.path + '/' : '/';
		options.name = options.name || 'icon';
		options.src = this._build_src_path(options);
		Cimage.call(this, options, [
				'name', 'format', 'size', 'path'
		]);
	}

	/**
	 * Inherits
	 */
	Module.prototype = Object.create(Cimage.prototype);
	Module.prototype.constructor = new Cimage();

	/**
	 * 
	 * @param options
	 * @returns {String}
	 */
	Module.prototype._build_src_path = function(options) {
		var baseUrl = window.graphit.baseStaticContent;
		if (!options.name) this
				.exception('mandatory_parameter_missing', 'name', this);
		return baseUrl + '/images/' + options.type + options.path
				+ options.name + '-' + options.size + '.' + options.format;
	};
	
	/**
	 * Method __test
	 * graphit[js/lib/Module.js]
	 * sho / 13 déc. 2012 / 23:07:27
	 */
	Module.prototype.__test = function(dumbopt) {
		console.log('overide Cobject.__test');
		return true;
	};
	
	/**
	 * Export
	 */
	graphit.export(modulePath, Module);
	
})(window, graphit, console);
