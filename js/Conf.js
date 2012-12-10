"use strict";

/* Define our namespace */
if ('graphit' in window) {
	throw 'graphit_already_defined_in_window';
}

window.graphit = {
		version: "0.1.1",
		author: "showi@github.com",
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
		baseStaticContent: 'http://static-graphit.dev/',
		baseScriptContent: '/',
	    baseRestContent: '/'
};
