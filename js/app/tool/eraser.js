(function(window, graphit, console, undefined) {
	
	var modulePath = 'app/tool/eraser';
	
	var Ctool = graphit.import('app/tool');
	
	/**
	 * Constructor / Module
	 */
	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.label = 'eraser';
		options.compositeOperation = Ecomposite_operation.xor;
		options.parameters = {
			size : {
				label : 'size',
				min : 1,
				max : 100,
				def : 20,
				step : 1
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
	 * @param cMessage
	 */
	Module.prototype.pre_graph = function(cMessage) {
		// console.log('pregraph');
		var c = cMessage.cSurface.layer_manager.special_layers.prefrag.cCanvas.data;
		var ctx = c.getContext('2d');
		var lm = cMessage.cSurface.layer_manager;
		var dc;
		if (lm.special_layers.stack_down) {
			dc = lm.special_layers.stack_down.cCanvas.data;
			ctx.drawImage(dc, 0, 0, dc.width, dc.height);
		}
		dc = lm.selected.cCanvas.data;
		// ctx.clearRect(0,0, c.width, c.height);
		ctx.drawImage(dc, 0, 0, dc.width, dc.height);
		// console.log('Copied layer', dc.toDataURL());
	};
	/**
	 * @param cMessage
	 */
	Module.prototype.post_graph = function(cMessage, x, y, width, height,
			dx, dy, dwidth, dheight) {// function(x,y,width,height,0,0,width,height)
										// {
		// cMessage) {
		var cSurface = cMessage.cSurface.layer_manager.selected;
		var f = cMessage.cSurface.layer_manager.special_layers.prefrag;
		var nf = f.clone();
		var ctx = nf.cCanvas.getContext('2d');
		// var width = cMessage.cMouse.maxx - cMessage.cMouse.minx;
		// var height = cMessage.cMouse.maxy - cMessage.cMouse.miny;
		ctx.save();
		ctx.clearRect(0, 0, nf.cCanvas.data.width, nf.cCanvas.data.height);
		ctx.globalCompositeOption = 'xor';
		ctx.drawImage(f.cCanvas.data, 0, 0, f.cCanvas.data.width,
				f.cCanvas.data.height);
		// console.log('WxH', width, height, cMessage);
		cSurface.drawImage(nf.cCanvas.data, x, y, width, height, 0, 0,
				'source-in');
		ctx.restore();
	};
	/**
	 * Method
	 */
	Module.prototype.graph = function(cMessage) {
		var dcanvas = cMessage.cSurface.layer_manager.special_layers.prefrag.cCanvas.data;
		var ctx = dcanvas.getContext('2d');
		cMessage.cSurface.layer_manager.special_layers.prefrag.down_composite_operation = Ecomposite_operation['source-in'];
		ctx.globalCompositeOperation = Ecomposite_operation['destination-out'];
		var scanvas = this.cCanvas.data;
		var dw = scanvas.width / 2;
		var dh = scanvas.height / 2;
		// var dctx = scanvas.getContext('2d');
		var pression = this.get_parameter('pression') || 100;
		var points = cMath.linear_interpolation(cMessage.A, cMessage.B,
				(100 / pression));
		for ( var i = 0; i < points.length; i++) {
			ctx.save();
			ctx.translate(points[i].x - dw, points[i].y - dh);
			ctx.drawImage(scanvas, 0, 0, scanvas.width, scanvas.height);
			ctx.restore();
		}
		ctx.restore();
		return true;
	};
	graphit.export(modulePath, Module);

})(window, graphit, console);
