"use strict";
/**
 * 11 All
 * 5 Verbose
 * 1 Normal
 */
var SHOJS_DEBUG = 1;

/**
 * Disable/Enable authentication feature (see /php/GoogleIdentity.conf)
 */
var SHOJS_AUTH = false;


/* Define our namespace */
if ('graphit' in window) {
	throw 'graphit_already_defined_in_window';
}
window.graphit = {
		debug: 1,
		authEnable: true,
		baseStaticContent: 'https://graphit.nosferat.us/static/'
};
