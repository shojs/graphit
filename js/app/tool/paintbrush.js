(function(window, graphit, console, undefined) {

	var modulePath = 'app/tool/paintbrush';
	
	var Ctool = graphit.import('app/tool');
	var cMath = graphit.import('lib/math');
	var Ccolor = graphit.import('lib/color');
	
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
	
	/**
	 * Method draw_preview
	 * graphit[js/app/tool/pencil.js]
	 * sho / 20 déc. 2012 / 09:24:52
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.draw_preview = function(canvas) {
		var size = this.parameters.size.value;
		var color = this.parent.color.fg.color;
		var invcolor = color.clone().inverse();
		canvas.clear(invcolor);
		color.a = this.parameters.opacity.value;
		var ctx = canvas.getContext('2d');
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = color.to_rgba();
		graphit.shape.circle(ctx, 50, 50, size / 2);
		ctx.fill();
		ctx.restore();
	};
	
	graphit.export(modulePath, Module);
	
})(window, graphit, console);
