/******************************************************************************
 * 
 * @param options
 * @returns
 */
function Ctool_parameter(options) {
	var checks = new Object({ label: 1, min: 1, max: 1, def: 1, step: 1 });
	for (k in checks) {
		if (!(k in options) || options[k] === undefined) {
			console.error('Missing parameter value', options, k);
			return null;
		}
		if (k == 'label') { this[k] = options[k]; }
		else { this[k] = parseInt(options[k]); }
	}
	return this;
}

/**
 * 
 */
var CTOOL_tools = {
		pen: {
			parameters: {
				size: { label: 'size', min: 0, max: 100, def: 20, step: 0.1 },
				opacity: { label: 'opacity', min: 0, max: 100, def: 20, step: 0.1 },
			},
			update: function(obj) {
				console.log('Update pen');
			},
		},
		eraser: {
			label: 'eraser',
			parameters: {
				size: { label: 'size', min: 0, max: 100, def: 20, step: 0.1 },
				opacity: { label: 'opacity', min: 0, max: 100, def: 20, step: 0.1 },
			},
			update: function(obj) {
				console.log('Update pen');
			},
		},
		fill: {
			label: 'fill',
			parameters: {
				size: { label: 'size', min: 0, max: 100, def: 20, step: 0.1 },
				opacity: { label: 'opacity', min: 0, max: 100, def: 20, step: 0.1 },
			},
			update: function(obj) {
				console.log('Update pen');
			},
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
	this.cCanvas = null;
	this.need_update = true;
	this.rootElm = null;
	console.log('Creating brush', label);
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

Ctool.prototype.set_parameter = function(key, value) {
	console.log('Key: ' + key);
	if (key in this.parameters) {
		this.parameters[key].cur = value;
	} else {
		this.add_parameter({label: key, min: value, max: value, def: value});
	}
};

Ctool.prototype.add_parameter = function(options) {
	console.log('Add parameter', options);
	if (options.label in this.parameters) {
		console.error('Parameter already registered', options);
		return false;
	}
	var p = new Ctool_parameter(options);
	this.parameters[p.label] = p;
	return true;
};

Ctool.prototype.update = function(elapsed) {
	if (this.need_update) {
		return this._update(elapsed);
	}
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
	console.log('Clicked', this);
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
		callback_onload: function(obj) { console.log('Tool image loaded', obj); },
		callback_click: function(obj) { that.callback_click(obj); }
	});
	return $(img.dom_get());
};


Ctool.prototype.callback_click = function(obj) {
	console.log('Tool clicked', this);
	if (this.parent) {
		this.parent.select_tool(this);
	}
};

//
///******************************************************************************
// * 
// * @param parent
// * @returns
// */
//function Ctool_pen(parent) {
//	Ctool.call(this, parent, 'pen');
//	this.add_parameter({label: 'size', min: 0, max: 100, def: 20, step: 0.1  });
//	this.add_parameter({label: 'opacity', min: 0, max: 1, def: 1, step: 0.1});
//	this.add_parameter({label: 'rotation', min: 0, max: 360, def: 0, step: 0.1});
//	this.add_parameter({label: 'pression', min: 0, max: 360, def: 0, step: 0.1});
//};
//
//Ctool_pen.prototype = Object.create(Ctool.prototype);
//Ctool_pen.prototype.constructor = new Ctool();
//
//Ctool_pen.prototype._update = function() {
//	console.log('Updating brush');
//};
