(function(window, graphit, console, undefined) {

	'use strict';

	var modulePath = 'app/boot';

	var testing = false;
	
	var Module = function() {
		
		/* Install core component */
		var CoreUi = new(graphit.import('app/core/ui'));
		graphit.add_component = CoreUi.add_component;
		graphit.add_component('ui', CoreUi);
		graphit.add_component('widget', new(graphit.import('lib/widget/manager'))());
		if (testing) {
			graphit.import('app/boot/test')();
		} else {
			var toolbox = new(graphit.import('app/ui/toolbox'));
			graphit.widget.add(toolbox);
			var w = graphit.widget.get({label: 'widget_toolbox'});
			w.show();
			//var Graphit = new(graphit.import('app/graphit'));
			//Graphit.dom_get().dialog();
		}
	};

	Module.prototype.__test = function() {
		return true;
	};

	graphit.export(modulePath, Module);

})(window, graphit, console);
