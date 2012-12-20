/**
 * Module lib/widget/manager
 * graphit[js/lib/widget/manager.js]
 * sho / 18 déc. 2012 / 08:39:51
 */
(function(window, project, console, undefined) {

	'use strict';

	var DEBUG = project.debug;
	var modulePath = 'lib/widget/manager';

	var Cobject = project.import('lib/object');

	/**
	 * graphit[js/lib/widget/manager.js]
	 * sho / 18 déc. 2012 / 08:39:51
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
	 * Method init
	 * graphit[js/lib/widget/manager.js]
	 * sho / 18 déc. 2012 / 08:42:05
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.init = function(dumbopt) {
		this.widgets = [];
	};
	
	
	/**
	 * Method add
	 * graphit[js/lib/widget/manager.js]
	 * sho / 18 déc. 2012 / 08:42:39
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.add = function(widget) {
		var Cwidget = project.import('lib/widget');
		if (!(widget instanceof Cwidget)) {
			this.exception('add_unknow_type', widget);
		}	
		this.widgets.push(widget);
	};
	
	/**
	 * Method get
	 * graphit[js/lib/widget/manager.js]
	 * sho / 18 déc. 2012 / 08:46:38
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.get = function(params) {
		for (var i = 0; i < this.widgets.length; i++) {
			var w = this.widgets[i];
			console.log(w);
			if ('id' in params && w.uid == params.uid) { return w; }
			else if ('label' in params && w.label == params.label) { return w;}
		}
		return null;
	};
	
	/**
	 * Method list
	 * graphit[js/lib/widget/manager.js]
	 * sho / 18 déc. 2012 / 09:02:56
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.list = function(callback) {
		if (!callback || typeof callback != 'function') {
			this.exception('need_callback_parameter');
		}
		for(var i = 0; i < this.widgets.length; i++) {
			callback.call(this, i, this.widgets[i]);
		}
	};
	
	
	/**
	 * Test
	 */
	Module.prototype.__test = function() {
		var M = project.import(modulePath);
		var m = new M();
	};

	/* Export */
	project.export(modulePath, Module);

})(window, graphit, console);