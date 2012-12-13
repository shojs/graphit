(function(window, graphit, console, undefined) {

	'use strict';

	/**
	 * Imports
	 */
	var Cjquery_theme_injector = graphit.import('Cjquery_theme_injector');

	/**
	 * Boot
	 */
	graphit['boot'] = function() {
		var sep = '--------------------------------------------------------------------------------';
		var tests = [
				'Cobject', 'Clocal_storage'
		];
		var fnl = function(msg) {
			console.debug(sep);
			console.log('%c' + msg, "background-color: black; color: white");
		};
		var fns = function(msg) {
			console.debug('%c' + msg, "background-color:#00FA00; color: black");
		};
		var fni = function(key, value) {
			console.debug('%c - ' + key + ' => ' + value,
					"background-color:#00A000;font-weight: bold");
		};
		fnl('START');
		fnl('[Testing Language]');
		console.debug('Langue:', getLanguage());
		var numTest = 0;
		var numSuccess = 0;
		var d = '----- ';
		for ( var label in graphit.bird) {
			var error = null;
			console.log(d + d + d + d);
			var str = '[' + numTest + '] Testing ' + label;
			console.log(str);
			var proto = graphit.bird[label].prototype;
			var success = false;
			if (!('__test' in proto)) {
				fni('No method', '__test');
				numTest++;
				continue;
			}
			try {
				var Co = graphit.import(label);
				var o = new Co();
				success = o.__test.call(o);
				success = true;
				numSuccess++;
			} catch (e) {
				error = {
					'original' : e,
					'message' : e.message,
				};
				if (typeof e === 'object' && 'to_s' in e) {
					error['to_s'] = e.to_s();
				}
			}
			str = '[' + numTest + '] Result ' + label + ': %c';
			if (success) {
				console
						.log(str + 'Ok',
								'background-color: black; color: green');
			} else {
				console
						.log(str + 'Fail',
								'background-color: black; color: red');
				console.error('Error in <<< ', label, ' >>>');
				console.error(error, error['original']);
				if (error['original']['type'] == 'shojs-exception') {
					widget_exception(error['original']);
				}

			}
			numTest++;
		}
		console.log('Test', numSuccess, '/', numTest);
	};
})(window, graphit, console);
