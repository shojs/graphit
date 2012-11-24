var CTOOL_brushes = {
	circle : {
		width : 100,
		height : 100,
		callback_update : function() {
			var toolbox = this.parent.parent;
			if (!(toolbox instanceof Ctoolbox)) {
				console.error('Brush parent of parent must be a toolbox');
				return false;
			}
			var color = toolbox.fg_color.color.clone();
			var tool = toolbox.selected;
			if (tool && 'opacity' in tool.parameters) {
				color.a = tool.parameters.opacity.value;
			}
			var dsize = this.cCanvas.data.width / 2;
			this.cCursor = new Ccanvas({
				width : this.cCanvas.width,
				height : this.cCanvas.height
			});

			cDraw.circle({
				dcanvas : this.cCursor.data,
				x : dsize,
				y : dsize,
				r : dsize,
				fillStyle : new Ccolor(255, 0, 0, 0.4),
				strokeStyle : new Ccolor(255, 0, 0, 1),
				lineWidth : 1
			});
			cDraw.circle({
				dcanvas : this.cCanvas.data,
				x : dsize,
				y : dsize,
				r : dsize,
				fillStyle : color
			});
		},
	},
	scircle : {
		width : 100,
		height : 100,
		callback_update : function() {
			var toolbox = this.parent.parent;
			if (!(toolbox instanceof Ctoolbox)) {
				console.error('Brush parent of parent must be a toolbox');
				return false;
			}
			var color = toolbox.fg_color.color.clone();
			var tool = toolbox.selected;
			if (tool && 'opacity' in tool.parameters) {
				color.a = tool.parameters.opacity.value;
			}
			var dsize = this.cCanvas.data.width / 2;
			this.cCursor = new Ccanvas({
				width : this.cCanvas.width,
				height : this.cCanvas.height
			});

			cDraw.circle({
				dcanvas : this.cCursor.data,
				x : dsize,
				y : dsize,
				r : dsize,
				fillStyle : new Ccolor(255, 0, 0, 0.4),
				strokeStyle : new Ccolor(255, 0, 0, 1),
				lineWidth : 1
			});
			cDraw.circle({
				dcanvas : this.cCanvas.data,
				x : dsize,
				y : dsize,
				r : dsize,
				strokeStyle : color
			});
		},
	},
	rectangle : {
		width : 100,
		height : 100,
		callback_update : function() {
			var toolbox = this.parent.parent;
			if (!(toolbox instanceof Ctoolbox)) {
				console.error('Brush parent of parent must be a toolbox');
				return false;
			}
			var color = toolbox.fg_color.color.clone();
			var tool = toolbox.selected;
			if (tool && 'opacity' in tool.parameters) {
				color.a = tool.parameters.opacity.value;
			}
			var size = this.cCanvas.data.width;
			this.cCursor = new Ccanvas({
				width : this.cCanvas.width,
				height : this.cCanvas.height
			});
			
			var ctx = this.cCursor.getContext();
			ctx.save();
			ctx.clearRect(0,0, size, size);
			ctx.strokeStyle = color.to_rgba();
			ctx.strokeRect(0,0, size, size);
			ctx.restore();
			ctx = this.cCanvas.getContext();
			ctx.save();
			ctx.clearRect(0,0, size, size);
			ctx.fillStyle = color.to_rgba();
			ctx.fillRect(0,0, size, size);
			ctx.restore();
		}

	}
};

var Ecomposite_operation = {
	'source-over' : 'source-over',
	'source-in' : 'source-in',
	'source-out' : 'source-out',
	'source-atop' : 'source-atop',
	'lighter' : 'lighter',
	'xor' : 'xor',
	'destination-over' : 'destination-over',
	'destination-in' : 'destination-in',
	'destination-out' : 'destination-out',
	'destination-atop' : 'destination-atop',
	'darker' : 'darker'
};
/**
 * 
 */
var CTOOL_tools = {
	/* PEN */
	pen : {
		label : 'pen',
		parameters : {
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
		// linejoin: { type: Eparameter_type.select, label: 'linejoin', choices:
		// { bevel: 'bevel', round: 'round', miter: 'mitter' }, def: 'round' },
		},
		brush : CTOOL_brushes.circle,
		_graph : function(grapher, p1, p2) {
			var dcanvas = grapher.parent.selected.layer_manager.special_layers.prefrag.cCanvas.data;
			var ctx = dcanvas.getContext('2d');
			var size = this.parameters.size.value;
			// console.log('size', size);

			ctx.save();
			ctx.lineWidth = Math.round(this.parameters.size.value);
			var color = this.parent.fg_color.color.clone();
			color.a = this.parameters.opacity.value;
			ctx.strokeStyle = color.to_rgba();
			// console.log('params', this.parameters);
			ctx.lineCap = this.parameters.linecap.value;
			// ctx.lineJoin = this.parameters.linejoin.value;
			// ctx.miterLimit = 1000;
			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			// ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
			return true;
		}

	},
	/***************************************************************************
	 * BRUSH
	 **************************************************************************/
	brush : {
		label : 'brush',
		parameters : {
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
		},
		brush : CTOOL_brushes.circle,
		_update : function() {
			return true;
		},
		_graph : function(grapher, p1, p2) {
			var dcanvas = grapher.parent.selected.layer_manager.special_layers.prefrag.cCanvas.data;
			var ctx = dcanvas.getContext('2d');
			var scanvas = this.cCanvas.data;
			var dw = scanvas.width / 2;
			var dh = scanvas.height / 2;
			// console.log(dw, dh);
			var dctx = scanvas.getContext('2d');
			var pression = this.get_parameter('pression');
			var points = cMath.linear_interpolation(p1, p2, 100 / pression);
			if (points.length <= 0) {
				return false;
			}
			for ( var i = 0; i < points.length; i++) {
				ctx.save();
				ctx.translate(points[i].x - dw, points[i].y - dh);
				ctx.drawImage(scanvas, 0, 0, scanvas.width, scanvas.height);
				ctx.restore();
			}
			return true;
		}
	},
	/***************************************************************************
	 * Eraser
	 **************************************************************************/
	eraser : {
		label : 'eraser',
		parameters : {
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
		},
		compositeOperation : Ecomposite_operation.xor,
		brush : CTOOL_brushes.circle,
		_update : function() {
			//
		},
		_pregraph : function(x, y, width, height) {
			// console.log('pregraph');
			var c = this.parent.parent.layer_manager.special_layers.prefrag.cCanvas.data;
			var ctx = c.getContext('2d');
			var lm = this.parent.parent.layer_manager;
			var dc;
			if (lm.special_layers.stack_down) {
				dc = lm.special_layers.stack_down.cCanvas.data;
				ctx.drawImage(dc, 0, 0, dc.width, dc.height);
			}
			dc = lm.selected.cCanvas.data;
			// ctx.clearRect(0,0, c.width, c.height);
			ctx.drawImage(dc, 0, 0, dc.width, dc.height);
			// console.log('Copied layer', dc.toDataURL());

		},
		_graph : function(grapher, p1, p2) {
			var dcanvas = grapher.parent.selected.layer_manager.special_layers.prefrag.cCanvas.data;
			var ctx = dcanvas.getContext('2d');
			grapher.cSurface.layer_manager.special_layers.prefrag.down_composite_operation = Ecomposite_operation['source-in'];
			ctx.globalCompositeOperation = Ecomposite_operation['destination-out'];
			var scanvas = this.cCanvas.data;
			var dw = scanvas.width / 2;
			var dh = scanvas.height / 2;
			var dctx = scanvas.getContext('2d');
			var pression = this.get_parameter('pression') || 100;
			var points = cMath.linear_interpolation(p1, p2, (100 / pression));
			for ( var i = 0; i < points.length; i++) {
				ctx.save();
				ctx.translate(points[i].x - dw, points[i].y - dh);
				ctx.drawImage(scanvas, 0, 0, scanvas.width, scanvas.height);
				ctx.restore();
			}
			ctx.restore();
			return true;
		},
		_postgraph : function(x, y, width, height) {
			var l = this.parent.parent.layer_manager.selected;
			var f = this.parent.parent.layer_manager.special_layers.prefrag;
			var nf = f.clone();
			nf.ctx.save();
			nf.ctx.clearRect(0, 0, nf.cCanvas.data.width,
					nf.cCanvas.data.height);
			nf.ctx.globalCompositeOption = 'xor';
			nf.ctx.drawImage(f.cCanvas.data, 0, 0, f.cCanvas.data.width,
					f.cCanvas.data.height);

			l
					.drawImage(nf.cCanvas.data, x, y, width, height, 0, 0,
							'source-in');
			nf.ctx.restore();
		}
	}
};
