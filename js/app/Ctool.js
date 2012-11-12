/*******************************************************************************
 * 
 * @param parent
 * @param label
 * @returns
 */
function Ctool(options) {
	this.brush = null;
	this.cCanvas = null;
	this.need_update = true;
	this.rootElm = null;
	this.optElm = null;
	this.label = null;
	this.className = 'Ctool';
	Cobject.call(this, options, [ 'parent', 'brush', 'label', '_graph' ]);
	return this;
};

Ctool.prototype = Object.create(Cobject.prototype);
Ctool.prototype.constructor = new Cobject();

/**
 * 
 * @param width
 * @param height
 * @returns
 */
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

/**
 * 
 * @param options
 * @returns {Boolean}
 */
Ctool.prototype.set_options = function(options) {
	if (!options.brush) {
		console.error('No brush in Ctool options');
		return false;
	}
};

/**
 * 
 * @param elapsed
 * @returns {Boolean}
 */
Ctool.prototype.update = function(elapsed) {
	this.need_update = true;
	if (!this.need_update) {
		console.log('Doesn\'t need update');
		return false;
	}
	// if (!('size' in this.parameters)) { console.error('We need a size
	// parameter'); return false;}
	var size = this.get_parameter('size');
	if (!size) {
		console.error("All tools need << size >> parameter");
		return false;
	}
	this.cCanvas = new Ccanvas(size * 2, size * 2);
	this.ctx = this.cCanvas.getContext('2d');
	if ('pre_update' in this) {
		console.log('Calling pre_update');
		this.pre_update.call(this, this);
	}
	// this.brush.update.call(this, this);
	// if ('post_update' in this.brush) {
	// this.brush.post_update.call(this, this);
	// }
	this.need_update = false;
	return true;
};

/**
 * 
 */
Ctool.prototype.drawImage = function(t_canvas, tx, ty) {
	var ctx = t_canvas.getContext('2d');
	var sc = this.cCanvas.canvas;
	if (!ctx) {
		console.error('Cannot acquire context');
		return false;
	}
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

/**
 * 
 */
Ctool.prototype.onclick = function() {
	if ('callback_onclick' in this.options
			&& (typeof this.options.callback_onclick === 'function')) {
		this.options.callback_onclick(this);
	}
};

/**
 * 
 * @param force
 * @returns
 */
Ctool.prototype.dom_build = function(force) {
	if (this.rootElm && !force) {
		return this.rootElm;
	}
	var $r = $(document.createElement('div'));
	$r.append(this.dom_build_tool());
	this.rootElm = $r;
	return this;
};

/**
 * 
 * @returns
 */
Ctool.prototype.dom_build_tool = function() {
	var that = this;
	var img = new Cimage({
		src : 'img/32x32_tool_' + this.label + '.png',
		callback_onload : function(obj) {
			;
		},
		callback_click : function(obj) {
			that.callback_click.call(that, obj);
		}
	});
	return $(img.dom_get());
};

/**
 * 
 * @returns
 */
Ctool.prototype.dom_build_options = function() {
	if (this.optElm) {
		return this.optElm;
	}
	var that = this;
	var $r = $(document.createElement('div'));
	$r.addClass('not-draggable');
	for (label in this.parameters) {
		var param = this.parameters[label];
		param.callback_slide = function(value) {
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

/**
 * 
 * @param obj
 */
Ctool.prototype.callback_click = function(obj) {
	if (this.parent) {
		this.parent.select_tool(this);
	}
};

/* Graph one point */
Ctool.prototype.graph = function(grapher, p1, p2) {
	/* Calling brush graph function */
	return this._graph(grapher, p1, p2);
};
