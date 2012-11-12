/******************************************************************************
 * 
 * @param options
 * @returns
 */
function Ctool_parameter(options) {
	if (!options.parent) { console.log('Ctool_parameter require parent in options {...}');}
	this.parent = options.parent;
	this.checks = new Object({ label: 1, min: 1, max: 1, def: 1, step: 1,});
	for (k in this.checks) {
		if (!(k in options) || options[k] === undefined) {
			console.error('Missing parameter key/value', options, k);
			return null;
		}
		if (k == 'label') { this[k] = options[k]; }
		else { this[k] = parseFloat(options[k]); }
	}
	if ('callback_onchange' in options && typeof(options.callback_onchange) == 'function') {
		this.callback_onchange = options.callback_onchange;
	};
	this.reset();
	return this;
}

Ctool_parameter.prototype.reset = function() {
	this.set(this.def);
};

Ctool_parameter.prototype.get = function(k) {
	if (!(k in this)) {
		console.error('Invalid key', k);
		return null;
	}
	return this[k];
};

Ctool_parameter.prototype.set = function(v) {
	v = parseFloat(v);
	if (v == this.value) {
		return this;
	}
	if ('callback_onchange' in this && typeof(this.callback_onchange) == 'function') {
		this.callback_onchange.call(this, v);
	}
	this.value = v;
	return this;
};

var CTOOL_brushes = {
		circle : {
			update: function(obj) {
				var size = this.parameters.size.value;
//				this.cCanvas = new Ccanvas(size*2, size*2);
				
				var dsize = size;
				helper_draw_circle(this.cCanvas, dsize, dsize, size, this.parent.fg_color.to_rgba());
			},
			
		},

	};
/**
 * 
 */
var CTOOL_tools = {
		pen: {
			label: 'pen',
			parameters: {
				size: { label: 'size', min: 0, max: 100, def: 20, step: 1 },
				opacity: { label: 'opacity', min: 0, max: 1, def: 1, step: 0.01 },
			},
			brush: CTOOL_brushes.circle,
		},
		brush: {
			label: 'brush',
			parameters: {
				size: { label: 'size', min: 0, max: 100, def: 20, step: 1 },
				opacity: { label: 'opacity', min: 0, max: 1, def: 1, step: 0.1 },
				rotation: { label: 'rotation', min: 0, max: 360, def: 0, step: 0.1 },
			},
			brush: CTOOL_brushes.circle,
		},
		eraser: {
			label: 'eraser',
			parameters: {
				size: { label: 'size', min: 0, max: 100, def: 20, step: 0.1 },
				opacity: { label: 'opacity', min: 0, max: 100, def: 20, step: 0.1 },
			},
			brush: CTOOL_brushes.circle,
			pre_update: function() {
				//this.ctx.fillStyle = 'rgba(255,255,255,0)';
				//this.ctx.fillRect(0,0,this.cCanvas.data.width, this.cCanvas.data.height);
				//this.ctx.globalCompositeOperation = 'xor'; 
			},
			//globalCompositeOperation: 'destination-out',
		},
		fill: {
			label: 'fill',
			parameters: {
				size: { label: 'size', min: 0, max: 100, def: 20, step: 0.1 },
				opacity: { label: 'opacity', min: 0, max: 100, def: 20, step: 0.1 },
			},
			brush: CTOOL_brushes.circle,
		}
		
};

/******************************************************************************
 * 
 * @param parent
 * @param label
 * @returns
 */
function Ctool(parent, label) {
	if (!label) { console.warn('Creating Ctool without label');  }
	Cobject.call(this);
	this.label = label;
	this.parent = parent;
	this.parameters = {};
	this.brush = null;
	this.cCanvas = null;
	this.need_update = true;
	this.rootElm = null;
	this.optElm = null;
	this.globalCompositeOperation = 'source-over'; //'source-over';
	return this;
};

Ctool.prototype = Object.create(Cobject.prototype);
Ctool.prototype.constructor = new Cobject();


Ctool.prototype.canvas_create = function(width, height) {
	if (!width || width < 0 || width > 1920) {
		console.error('Width not in range', width);
		return null;
	} else if (!height || height < 0 || height > 1080) {
		console.error('Height not in range', height);
		return null;
	}
	this.set_parameter('width', width);
	this.set_parameter('height', height);
};

Ctool.prototype.set_brush = function(brush) {
	if (!brush) {
		console.error('Brush is null');
		return this;
	}
	console.log('Brush set to', brush);
	this.brush = brush;
	return this;
};

Ctool.prototype.set_parameter = function(key, value) {
	if (key in this.parameters) {
		this.parameters[key].cur = value;
	} else {
		this.add_parameter({label: key, min: value, max: value, def: value});
	}
};

Ctool.prototype.add_parameter = function(options) {
	var that = this;
	if (options.label in this.parameters) {
		console.error('Parameter already registered', options);
		return false;
	}
	options.callback_onchange = function(value) {
		this.need_update = true;
		this.parent.update();
	};
	options.parent = this;
	var p = new Ctool_parameter(options);

	this.parameters[p.label] = p;
	return true;
};

Ctool.prototype.update = function(elapsed) {
	this.need_update = true;
	if (!this.need_update) { 
		console.log('Doesn\'t need update');
		return false;
	}
	if (!('size' in this.parameters)) { console.error('We need a size parameter'); return false;}
	var size = this.parameters.size.value;
	if (!size) { console.error("No size"); }
	this.cCanvas = new Ccanvas(size*2, size*2);
	this.ctx = this.cCanvas.getContext('2d');
	if ('pre_update' in this) {
		console.log('Calling pre_update');
		this.pre_update.call(this, this);
	}
	this.brush.update.call(this, this);
	if ('post_update' in this.brush) {
		this.brush.post_update.call(this, this);
	}	
	this.need_update = false;
	return true;
};

Ctool.prototype.drawImage = function(t_canvas, tx, ty) {
	var ctx = t_canvas.getContext('2d');
	var sc = this.cCanvas.canvas;
	if (!ctx) { console.error('Cannot acquire context'); return false; }
	if (tx > t_canvas.width || tx < 0) {
		console.error('x not in canvas destination range', tx);
		return false;
	}
	if (ty > t_canvas.height || ty < 0) {
		console.error('y not in canvas destination range', ty);
		return false;
	}
	ctx.drawImage(sc, 0, 0, sc.width, sc.height, tx, ty, sc.width, sc.height);
	return true;
};

Ctool.prototype.onclick = function() {
	if ('callback_onclick' in this.options && 
			typeof(this.options.callback_onclick) === 'function') {
		this.options.callback_onclick(this);
	}
};

Ctool.prototype.dom_build = function(force) {
	if (this.rootElm && !force) {
		return this.rootElm;
	}
	var $r = $(document.createElement('div'));
	$r.append(this.dom_build_tool());
	this.rootElm = $r;
	return this;
};

Ctool.prototype.dom_build_tool = function() {
	var that = this;
	var img = new Cimage({
		src: 'img/32x32_tool_' + this.label + '.png',
		callback_onload: function(obj) { ; },
		callback_click: function(obj) { that.callback_click(obj); 
		lagel = this.label;
		}
	});
	return $(img.dom_get());
};

Ctool.prototype.dom_build_options = function() {
	if (this.optElm) { return this.optElm; }
	var that = this;
	var $r = $(document.createElement('div'));
	$r.addClass('not-draggable');
	for (label in this.parameters) {
		var param = this.parameters[label];
		param.callback_slide = function(value)  {
			this.set(value);
		};
		param.callback_change = function(value) { 	
			this.set(value);
		};
		widget_slider_ex(param, $r, param);
	}
	this.optElm = $r;
	return $r;
};

Ctool.prototype.callback_click = function(obj) {
	if (this.parent) {
		this.parent.select_tool(this);
	}
};

Ctool.prototype.drawImage = function (dcanvas, dx, dy) {
	
};