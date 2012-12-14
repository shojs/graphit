(function(window, graphit, console, undefined) {

	'use strict';

	var modulePath = 'app/boot';

	var Module = function() {
		//graphit.import('app/boot/test')();
		var Graphit = new(graphit.import('app/graphit'));
		Graphit.dom_get().dialog();
	};

	Module.prototype.__test = function() {
		return true;
	};

	graphit.export(modulePath, Module);

})(window, graphit, console);
