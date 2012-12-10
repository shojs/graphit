"use strict";

/* Define our namespace */
if ('graphit' in window) {
	throw 'graphit_already_defined_in_window';
}

window.graphit = {
		/**
		 * 11 All
		 * 5 Verbose
		 * 1 Normal
		 */
		debug: 1,
		/**
		 * Disable/Enable authentication feature (see /php/GoogleIdentity.conf)
		 */
		authEnable: false,
		/**
		 * Our global access path
		 */
		baseStaticContent: 'http://shojs.github.com/graphit-static/',
		baseScriptContent: '/',
	    baseRestContent: '/'
};
