/**
 * Module app/core/ui
 * graphit[js/app/core/widget.js]
 * sho / 17 déc. 2012 / 01:37:34
 */
(function(window, project, console, undefined) {

	'use strict';

	var DEBUG = project.debug;
	
	var modulePath = 'app/core/ui';

	var Cobject = project.import('app/core/object');

	/**
	 * graphit[js/app/core/widget.js]
	 * sho / 17 déc. 2012 / 01:37:34
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
	 * Little helper for popin windows
	 * @constructor
	 * @param dom
	 * @param options
	 * @returns
	 */
	Module.prototype.widget_factory = function(dom, options) {
		options = options || {};
		if (!dom) {
			throw ('func_widget_factory_need_dom');
		}
		console.log('Widget factory', dom, options);
		var mandatory = {
			'autoOpen' : true,
			'resizable' : true,
			'draggable' : true,
			'width' : 250,
			'zIndex' : 10,
			'dialogClass' : 'shojs-dialog',
			'stack' : true
		};
		for ( var label in mandatory) {
			if (!(label in options)) {
				options[label] = mandatory[label];
			}
		}
		dom['dialog'](options);
		return dom;
	};
	
	/**
	 * 
	 * @param e
	 * @returns
	 */
	Module.prototype.widget_exception = function(e) {
		var Cexception_message = graphit.import('lib/exception');
		console.error('Widget', e);
		var msg = e;
		var title = '[Error] ';
		if (e instanceof Cexception_message) {
			msg = e.to_s({
				format : 'html'
			});
			title = title + e.className + '/' + e.label;
		}
		var r = $('<div title="' + title + '" />');
		r.append($('<p>' + msg + '<p/>'));
		r.dialog({
			modal : true
		});
		throw e;
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