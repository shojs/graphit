/**
 * Module lib/enum/cardinal
 * graphit[js/lib/enum/cardinal.js]
 * sho / 14 déc. 2012 / 12:40:04
 */
(function(window, graphit, console, undefined) {

	'use strict';

	var modulePath = 'lib/enum/cardinal';

	/**
	 * graphit[js/lib/enum/cardinal.js]
	 * sho / 14 déc. 2012 / 12:40:04
	 * @constructor
	 * @param options {Hash} Options hash
	 */
	var Module = {
		'nw' : 7,
		'n' : 0,
		'ne' : 1,
		'w' : 6,
		'e' : 2,
		'sw' : 5,
		's' : 4,
		'se' : 3

	};

	/* Export */
	graphit.export(modulePath, Module);

})(window, graphit, console);
