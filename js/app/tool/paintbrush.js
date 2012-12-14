(function(window, graphit, console, undefined) {

	var modulePath = 'app/tool/paintbrush';
	
	var Ctool = graphit.import('app/tool');
	var cMath = graphit.import('lib/math');
	
	/**
	 * Constructor / Module
	 */
	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.label = 'paintbrush';
		options.parameters = {
			size : {
				label : 'size',
				min : 1,
				max : 100,
				def : 20,
				step : 1
			},
			opacity : {
				label : 'opacity',
				min : 0,
				max : 1,
				def : 1,
				step : 0.01
			},
			pression : {
				label : 'pression',
				min : 0.1,
				max : 100,
				def : 100,
				step : 0.01
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
		var pression = this.get_parameter('pression');
		var points = cMath.linear_interpolation(cMessage.A, cMessage.B,
				100 / pression);
		if (points.length <= 0) {
			return false;
		}
		for ( var i = 0; i < points.length; i++) {
			ctx.save();
			points[i].round();
			ctx.translate(points[i].x - dw, points[i].y - dh);
			ctx.drawImage(scanvas, 0, 0, scanvas.width, scanvas.height);
			ctx.restore();
		}
		return true;
	};

	graphit.export(modulePath, Module);
	
})(window, graphit, console);
