(function(window, undefined) {
	"use strict";
	if ('graphit' in window) {
		console.log('Graphit already registered');
		//return;
	}
	/* Define our namespace */
	// if (!('graphit' in window)) {
	var Graphit = function() {
		this['version'] =  '0.1.1'; 
		this['author'] = 'showi@github.com';
		/**
		 * 11 All 5 Verbose 1 Normal
		 */
		this['debug'] = 1;
		/**
		 * Disable/Enable authentication feature (see /php/GoogleIdentity.conf)
		 */
		this['authEnable'] = false;
		/**
		 * Our global access path
		 */
		this['baseStaticContent'] = 'http://static-graphit.dev/';
		this['baseScriptContent'] = '/';
		this['baseRestContent'] = '/';
		/* STOP EDIT */
		this['_class_pool'] = {};
	};

	Graphit.prototype.getBird = function(name) {
		console.debug('graphit.getBird(', name, ')');
		if (!window.graphit) {
			console.error('No graphit in window');
			return null;
		}
		if (!window.graphit._class_pool) {
			console.error('No _class_pool in graphit');
			return null;
		}
		if (window.graphit._class_pool[name]) {
			return window['graphit']['_class_pool'][name];
		}
		return null;
	};
	Graphit.prototype['getBird'] = Graphit.prototype.getBird;
	
	/**
	 * @deprecated
	 * @param name
	 * @param newClass
	 * @returns
	 */
	Graphit.prototype.addBird = function(name, newClass) {
		if (name in window['graphit']['class_pool']) {
			throw ('Trying to register className twice');
		}
		console.log('Registering class', name, newClass);
		window['graphit']['_class_pool'][name] = newClass;
		return window['graphit']['_class_pool'][name];

	};
	Graphit.prototype['addBird'] = Graphit.prototype.addBird;
	
	window['graphit'] = new Graphit();	
	window['graphit']['_class_pool']['Graphit'] = Graphit;
	window.graphit = window['graphit'];
	console.log('Namespace << graphit >> added (window.graphit)');
})(window);
