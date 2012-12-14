(function(window, graphit, console, undefined) {

	var modulePath = 'app/tool/colorPicker';
	
	var Ctool = graphit.import('app/tool');
	var Ecomposite_operation = graphit.import('app/enum/compositeOperation');
	var Ccolor = graphit.import('lib/color');
	
	/**
	 * Constructor / Module
	 */
	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.label = 'color-picker';
		options.compositeOperation = Ecomposite_operation.xor;
		options.parameters = {
			size : {
				label : 'size',
				min : 1,
				max : 100,
				def : 20,
				step : 1
			},
		};
		Ctool.call(this, options, []);
	}

	/* Inheritance */
	Module.prototype = Object.create(Ctool.prototype);
	Module.prototype.constructor = new Ctool();

	Module.prototype.graph = function(cMessage) {
		var selected = cMessage.cSurface.layer_manager.get();
		if (!selected) {
			this.exception('no_layer_selected');
		}
		var data = selected.getImageData(0, 0, selected.get_width(), selected
				.get_height());
		var color = new Ccolor().from_pixel(data, cMessage.A);
		console.log('Selected color', color.to_s());
		cMessage.cToolbox.fg_color.color.set(color);
		cMessage.cGrapher.stop();
		return true;
	};

	graphit.export(modulePath, Module);

})(window, graphit, console);
