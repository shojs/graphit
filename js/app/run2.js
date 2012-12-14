(function(window, graphit, console, undefined) {

	'use strict';

	var modulePath = 'app/boot';
	/**
	 * Imports
	 */
	//var Cjquery_theme_injector = graphit.import('app/jquery/themeInjector', { 'delayed': true});

	/**
	 * Boot
	 */
	var Module = function() {
		var sep = '--------------------------------------------------------------------------------';
		var tests = [
				'Cobject', 'Clocal_storage'
		];
		var fnl = function(msg) {
			console.log( msg);
		};
		var fns = function(msg) {
			console.debug(msg);
		};
		var fni = function(key, value) {
			console.debug('- key' + ' => ' + value);
		};
		fnl('START');
		fnl('[Testing Language]');
		console.debug('Langue:', getLanguage());
		var numTest = 0;
		var numSuccess = 0;
		for ( var label in graphit.bird) {
			numTest++;
			var error = null;
			var str = '[' + numTest + '] Testing ' + label + ': ';
			var proto = graphit.bird[label].prototype;
			if (!proto) {
				console.log(str, graphit.bird[label]);
				numSuccess++;
				continue;
			}
			var success = false;
			if (!('__test' in proto)) {
				console.log(str + ' NO TEST');
				numSuccess++;
				continue;
			}
			try {
				var Co = graphit.import(label);
				success = proto.__test.call(o);
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
			if (success) {
				console
						.log(str + 'Ok');
			} else {
				console
						.log(str + 'Fail');
				console.error('Error in <<< ', label, ' >>>');
				console.error(error, error['original']);
				if (error['original']['type'] == 'shojs-exception') {
					widget_exception(error['original']);
				}

			}
		}
		console.log('Test ', numSuccess, ' / ', numTest);
		

	};
	
	Module.prototype.__test = function() {
		return true;
	};
	
	graphit.export(modulePath, Module);
	
})(window, graphit, console);
