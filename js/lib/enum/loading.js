/**
 * Module app/enum/loading
 * graphit[js/app/enum/loading.js]
 * sho / 14 déc. 2012 / 11:02:14
 */
(function(window, graphit, console, undefined) {

	'use strict';

	var modulePath = 'lib/enum/loading';

	/**
	 * graphit[js/app/enum/loading.js]
	 * sho / 14 déc. 2012 / 11:02:14
	 * @constructor
	 * @param options {Hash} Options hash
	 */
	var Module =  {
			none : 1,
			loading : 2,
			fail : 3,
			ok : 4
	};

	/* Export */
	graphit.export(modulePath, Module);

})(window, graphit, console);