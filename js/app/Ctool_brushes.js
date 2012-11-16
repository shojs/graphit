var CTOOL_brushes = {
    circle : {
	update : function(obj) {
	    var size = this.parameters.size.value;
	    // this.cCanvas = new Ccanvas(size*2, size*2);
	    var color = this.parent.fg_color.color.clone();
	    var tool = this.parent.selected;
	    if (tool && 'opacity' in tool.parameters) {
		color.a = tool.parameters.opacity.value;
	    }
	    var dsize = size;
	    helper_draw_circle(this.cCanvas, dsize, dsize, size,
		    color.to_rgba());
	},

    },

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
	    },
	// linejoin: { type: Eparameter_type.select, label: 'linejoin', choices:
	// { bevel: 'bevel', round: 'round', miter: 'mitter' }, def: 'round' },
	},
	brush : CTOOL_brushes.circle,
	_graph : function(grapher, p1, p2) {
	    var dcanvas = grapher.cSurface.layer_manager.special_layers.prefrag.canvas;
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
	},

    },
    /* BRUSH */
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
//	    rotation : {
//		label : 'rotation',
//		min : 0,
//		max : 360,
//		def : 0,
//		step : 0.1
//	    },
	    pression : {
		label : 'pression',
		min : 0.1,
		max : 1000,
		def : 0.1,
		step : 0.01
	    },
	},
	brush : CTOOL_brushes.circle,
	_update : function() {
	    console.log('update');
	    this.need_update = true;
	    if (!this.need_update) {
		console.log('Doesn\'t need update');
		return false;
	    }
	    var size = this.get_parameter('size');
	    if (!size) {
		console.error("All tools need << size >> parameter");
		return false;
	    }
	    this.cCanvas = new Ccanvas(size * 2, size * 2);
	    this.ctx = this.cCanvas.getContext('2d');
	    this.brush.update.call(this, this);
	    this.need_update = false;
	    return true;
	},
	_graph : function(grapher, p1, p2) {
	    // console.log('pen graphing');
	    var dcanvas = grapher.cSurface.layer_manager.special_layers.prefrag.canvas;
	    var ctx = dcanvas.getContext('2d');
	    var scanvas = this.cCanvas.data;
	    var dw = scanvas.width / 2;
	    var dh = scanvas.height / 2;
	    var dctx = scanvas.getContext('2d');
	    var pression = this.get_parameter('pression');
	    var points = math_linear_interpolation2(p1, p2, pression);
	    for ( var i = 0; i < points.length; i++) {
		ctx.save();
		ctx.translate(points[i].x - dw, points[i].y - dh);
		ctx.drawImage(scanvas, 0, 0, scanvas.width, scanvas.height);
		ctx.restore();
	    }
	    return true;
	},
    },
//    eraser : {
//	label : 'eraser',
//	parameters : {
//	    size : {
//		label : 'size',
//		min : 1,
//		max : 100,
//		def : 20,
//		step : 0.1
//	    },
//	    opacity : {
//		label : 'opacity',
//		min : 0,
//		max : 100,
//		def : 20,
//		step : 0.1
//	    },
//	},
//	brush : CTOOL_brushes.circle,
//	callback_pre_update : function() {
//	    // this.ctx.fillStyle = 'rgba(255,255,255,0)';
//	    // this.ctx.fillRect(0,0,this.cCanvas.data.width,
//	    // this.cCanvas.data.height);
//	    // this.ctx.globalCompositeOperation = 'xor';
//	},
//    // globalCompositeOperation: 'destination-out',
//    },
//    fill : {
//	label : 'fill',
//	parameters : {
//	    size : {
//		label : 'size',
//		min : 1,
//		max : 100,
//		def : 20,
//		step : 0.1
//	    },
//	    opacity : {
//		label : 'opacity',
//		min : 0,
//		max : 100,
//		def : 20,
//		step : 0.1
//	    },
//	},
//	brush : CTOOL_brushes.circle,
//    }

};