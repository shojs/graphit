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
	   // console.log('tool', tool);
//	    if (0 &&tool && tool.compositeOperation) {
//		//this.cCanvas.clear(new Ccolor(0,0,0,1));
//		this.cCanvas.ctx.globalCompositeOperation = tool.compositeOperation;
//	    } else {
//		this.cCanvas.ctx.globalCompositeOperation = Ecomposite_operation['source-over'];
//	    }
	    var dsize = size;

	    helper_draw_circle(this.cCanvas, dsize, dsize, size,
		    color.to_rgba());
	},

    },

};

var Ecomposite_operation = {
	'source-over': 'source-over',
	'source-in': 'source-in',
	'source-out': 'source-out',
	'source-atop': 'source-atop',
	'lighter': 'lighter',
	'xor': 'xor',
	'destination-over': 'destination-over',
	'destination-in': 'destination-in',
	'destination-out': 'destination-out',
	'destination-atop': 'destination-atop',
	'darker': 'darker',

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
    /**************************************************************************
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
		max : 100,
		def : 0.1,
		step : 0.01
	    },
	},
	brush : CTOOL_brushes.circle,
	_update : function() {
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
	    var dcanvas = grapher.cSurface.layer_manager.special_layers.prefrag.canvas;
	    var ctx = dcanvas.getContext('2d');
	    var scanvas = this.cCanvas.data;
	    var dw = scanvas.width / 2;
	    var dh = scanvas.height / 2;
	    var dctx = scanvas.getContext('2d');
	    var pression = this.get_parameter('pression');
	    var points = math_linear_interpolation2(p1, p2, 100 / pression);
	    if (points.length <= 0) {return false;}
	    for ( var i = 0; i < points.length; i++) {
		ctx.save();
		ctx.translate(points[i].x - dw, points[i].y - dh);
		ctx.drawImage(scanvas, 0, 0, scanvas.width, scanvas.height);
		ctx.restore();
	    }
	    return true;
	},
    },
    /**************************************************************************
     * Eraser
     *************************************************************************/
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
		max : 1000,
		def : 0.1,
		step : 0.01
	    },
	},
	compositeOperation: Ecomposite_operation.xor,
	brush : CTOOL_brushes.circle,
	_update : function() {
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
	    this.parent.parent.rootElm.css('cursor', "url('"+this.cCanvas.data.toDataURL()+"'), pointer, ne-resize:" + size);
	    return true;
	},
	_pregraph: function(x, y, width, height) {
	    $('body').append('<br>');
	    var c = this.parent.parent.layer_manager.special_layers.prefrag.canvas;
	    var ctx = c.getContext('2d');
	   
	   var dc = this.parent.parent.layer_manager.selected.canvas;
	  
	   ctx.drawImage(dc, 0,0, dc.width, dc.height);

	},
	_graph : function(grapher, p1, p2) {
	    var dcanvas = grapher.cSurface.layer_manager.special_layers.prefrag.canvas;
	    var ctx = dcanvas.getContext('2d');
	    grapher.cSurface.layer_manager.special_layers.prefrag.down_composite_operation = Ecomposite_operation['source-in'];
	    ctx.globalCompositeOperation = Ecomposite_operation['destination-out'];
	    var scanvas = this.cCanvas.data;
	    var dw = scanvas.width / 2;
	    var dh = scanvas.height / 2;
	    var dctx = scanvas.getContext('2d');
	    var pression = this.get_parameter('pression');
	    var points = math_linear_interpolation2(p1, p2, 100 /pression);
	    for ( var i = 0; i < points.length; i++) {
		ctx.save();
		ctx.translate(points[i].x - dw, points[i].y - dh);
		ctx.drawImage(scanvas, 0, 0, scanvas.width, scanvas.height);
		ctx.restore();
	    }
	    ctx.restore();
	    return true;
	},
	_postgraph: function(x, y, width, height) {
	    var l = this.parent.parent.layer_manager.selected;
	    var f = this.parent.parent.layer_manager.special_layers.prefrag;
	    var nf = f.clone();
	    nf.ctx.globalCompositeOption = 'xor';
	    nf.ctx.drawImage(f.canvas, 0, 0,  f.canvas.width, f.canvas.height);	    
	    l.drawImage(
			nf.canvas, x, y, width,
			height, 0, 0, 'source-in');
	},
	
    },


};