(function(window, graphit, console, undefined) {

	var modulePath = 'app/tool/pencil';
	
	var Ctool = graphit.import('app/tool');
	var Eparameter_type = graphit.import('lib/parameter/enum/type');
	
	/**
	 * Constructor / Module
	 */
	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.label = 'pencil';
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
			linecap : {
				type : Eparameter_type.select,
				label : 'linecap',
				choices : {
					round : 'round',
					butt : 'butt',
					square : 'square'
				},
				def : 'round'
			}
		};
		Ctool.call(this, options, []);
	}

	/* Inheritance */
	Module.prototype = Object.create(Ctool.prototype);
	Module.prototype.constructor = new Ctool();

	/**
	 * Method / Graph
	 */
	Module.prototype.graph = function(cMessage) {
		var dcanvas = cMessage.cSurface.layer_manager.special_layers.prefrag.cCanvas.data;
		var ctx = dcanvas.getContext('2d');
		var size = this.parameters.size.value;
		ctx.save();
		ctx.lineWidth = Math.round(this.parameters.size.value);
		var color = cMessage.fgColor.color.clone();
		color.a = this.parameters.opacity.value;
		ctx.strokeStyle = color.to_rgba();
		ctx.lineCap = this.parameters.linecap.value;
		ctx.beginPath();
		ctx.moveTo(cMessage.A.x, cMessage.A.y);
		ctx.lineTo(cMessage.B.x, cMessage.B.y);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		return true;
	};

	graphit.export(modulePath, Module);
	
})(window, graphit, console);
