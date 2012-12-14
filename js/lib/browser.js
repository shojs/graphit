/**
 * Module app/browser
 * graphit[js/lib/browser.js]
 * sho / 14 déc. 2012 / 06:11:25
 */
(function(window, graphit, console, undefined) {

	'use strict';

	var DEBUG = graphit.debug;
	
	var modulePath = 'app/browser';

	var Cobject = graphit.import('lib/object');

	/**
	 * graphit[js/lib/browser.js]
	 * sho / 14 déc. 2012 / 06:11:25
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
	 * Method get_language
	 * graphit[js/lib/browser.js]
	 * sho / 14 déc. 2012 / 06:13:18
	 * @return {String} 2 char language string fr/en/jp ...
	 */
	
	Module.prototype.get_language = function() {
		var lang = (navigator.language) ? navigator.language
				: navigator.userLanguage;
		var pat = /^\s*([^-]*)-([^\s]*)\s*$/;
		var match = pat.exec(lang);
		if (match) {
			return match[1];
		}
		return lang;
	};
	Module.prototype['get_language'] = Module.prototype.get_language;
	
	/**
	 * Method is_file_supported
	 * graphit[js/lib/browser.js]
	 * sho / 14 déc. 2012 / 06:15:12
	 * @return {Bool} True if file is supported 
	 */
	Module.prototype.is_file_supported = function() {
		// Check for the various File API support.
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			return true;
		}
		console.error('The File APIs are not fully supported in this browser.');
		return false;
	};
	Module.prototype['is_file_supported'] = Module.prototype.is_file_supported;
	
	
	/**
	 * Method is_canvas_supported
	 * graphit[js/lib/browser.js]
	 * sho / 14 déc. 2012 / 06:16:13
	 * @return {Bool} True if canvas supported
	 */
	Module.prototype.is_canvas_supported = function(dumbopt) {
		var elem = document.createElement('canvas');
		return !!(elem.getContext && elem.getContext('2d'));
	};
	Module.prototype['is_canvas_supported'] = Module.prototype.is_canvas_supported;
	
	/**
	 * Test
	 */
	Module.prototype.__test = function() {
		var M = graphit.import(modulePath);
		var m = new M();
		var str = 'File supported: ';
		if (m.is_file_supported()) str += 'yes';
		else str+= 'no';
		str += '\nCanvas supported: ';
		if (m.is_canvas_supported()) str += 'yes';
		else str += 'no';
		if (DEBUG) {
			console.log(str);
		}
		return true;
	};
	Module.prototype['__test'] = Module.prototype.__test;

	/* Export */
	graphit.export(modulePath, Module);

})(window, graphit, console);