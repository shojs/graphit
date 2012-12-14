(function(window, graphit, console, undefined) {

	var modulePath = 'app/tool/fill';
	
	var Ctool = graphit.import('app/tool');
	var Cimage_analyse = graphit.import('lib/image/analyse');
	/**
	 * Constructor / Module
	 */
	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.label = 'bucket-fill';
		options.parameters = {
			size : {
				label : 'size',
				min : 1,
				max : 100,
				def : 20,
				step : 1
			}
		};
		Ctool.call(this, options, []);
	}

	/* Inheritance */
	Module.prototype = Object.create(Ctool.prototype);
	Module.prototype.constructor = new Ctool();

	/**
	 * Method
	 */
	Module.prototype.graph = function(cMessage) {
		var dcanvas = cMessage.cSurface.layer_manager.special_layers.prefrag.cCanvas.data;
		var ctx = dcanvas.getContext('2d');
		var scanvas = this.cCanvas.data;
		var dw = scanvas.width / 2;
		var dh = scanvas.height / 2;
		// console.log(cMessage);
		var lmanager = cMessage.cSurface.layer_manager;
		var slayer = lmanager.get();
		if (!slayer) {
			console.error('No layer selected');
			return false;
		}
		var data = slayer.getImageData(0, 0, slayer.get_width(), slayer
				.get_height());
		// var points = cMath.linear_interpolation(cMessage.A, cMessage.B);
		var analyse = new Cimage_analyse();
		var pool = analyse.adjacent_by_color(data, cMessage.A);
		var color = cMessage.cToolbox.fg_color.color;
		for ( var i = 0; i < pool.length; i++) {
			if (pool[i] != 1) continue;
			// var point = pool[i];
			var fidx = i * 4;
			data.data[fidx] = color.r;
			data.data[fidx + 1] = color.g;
			data.data[fidx + 2] = color.b;
			data.data[fidx + 3] = 255;// color.a;
		}
		cMessage.cMouse.minx = 0;
		cMessage.cMouse.miny = 0;
		cMessage.cMouse.maxx = data.width;
		cMessage.cMouse.maxy = data.height;
		ctx.putImageData(data, 0, 0);
		// cMessage.cSurface.layer_manager.special_layers.prefrag.cCanvas.dom_get().dialog();
		cMessage.cGrapher.stop();
		return true;
	};

	graphit.export(modulePath, Module);

})(window, graphit, console);
