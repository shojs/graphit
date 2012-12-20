(function(window, graphit, console, undefined) {

	'use strict';

	var modulePath = 'app/boot/test';

	var Module = function() {
		var that = this;
		console.log('[ Starting ]');
		var numTest = 0;
		var numSuccess = 0;
		for ( var label in graphit.egg) {
			numTest++;
			var error = null;
			var str = '[ Testing ] ' + numTest + ' / ' + label + ' / ';
			var proto = graphit.egg[label].prototype;
			if (!proto) {
				console.log(str, graphit.egg[label]);
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
				success = proto.__test.call(that);
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
				console.log(str + 'Ok');
			} else {
				console.log(str + 'Fail');
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
