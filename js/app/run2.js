(function($NS) {
	'use strict';
	window.graphit = window['graphit'];
	var getBird = window.graphit['getBird'];
	var Cjquery_theme_injector = getBird('Cjquery_theme_injector');
	$NS['_boot_code'] = function() {
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
		fnl('Injecting CSS');
		console.log("plop", Cjquery_theme_injector);
		try {
			//var injected = new Cjquery_theme_injector();
			
		} catch(e) {
		    console.error('Cannot inject css file', e.message);
		}
		fnl('[Testing Language]');
		//console.debug('Langue:', getLanguage());
		var numTest = 0;
		var numSuccess = 0;
		var d = '----- ';
		for ( var label in graphit._class_pool) {
			var error = null;
			console.log(d + d + d + d);
			var str = '[' + numTest + '] Testing ' + label;
			console.log(str);
			var proto = graphit._class_pool[label].prototype;
			var success = false;
			if (!('__test' in proto)) {
				fni('No method', '__test');
				continue;
			}
			try {
				var Co = window.graphit.getBird(label);
				var o = new Co();
				success = o.__test();
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
})(graphit);
