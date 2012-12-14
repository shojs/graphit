/**
 * Module app/enum/compositeOperation
 * graphit[js/app/enum/composite_operation.js]
 * sho / 14 déc. 2012 / 10:26:07
 */
(function(window, graphit, console, undefined) {

	'use strict';

	var modulePath = 'app/enum/compositeOperation';

	/**
	 * graphit[js/app/enum/composite_operation.js]
	 * sho / 14 déc. 2012 / 10:26:07
	 * @constructor
	 * @param options {Hash} Options hash
	 */
	var Module = {
				'source-over' : 'source-over',
				'source-in' : 'source-in',
				'source-out' : 'source-out',
				'source-atop' : 'source-atop',
				'lighter' : 'lighter',
				'xor' : 'xor',
				'destination-over' : 'destination-over',
				'destination-in' : 'destination-in',
				'destination-out' : 'destination-out',
				'destination-atop' : 'destination-atop',
				'darker' : 'darker'
	};

	/* Export */
	graphit.export(modulePath, Module);

})(window, graphit, console);