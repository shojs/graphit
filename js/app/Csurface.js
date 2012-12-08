/*******************************************************************************
 * @param width
 * @param height
 * @returns
 */
function Csurface(options) {
	var that = this;
	options = options || {};
	options.className = 'Csurface';
	options.label = 'surface', options.parameters = {
		zoom : {
			label : 'zoom',
			min : -100,
			max : 100,
			def : 0,
			step : 1,
			autoSave : false,
			callback_slide : function() {
				console.log('slidinggggggg', this);
			}
		}
	};
	Cobject.call(this, options, [
			'width', 'height', 'label'
	]);
	// We are checking width and height
	var cwidth = this.width || 0;
	var cwidth = cMath.clamp(1, cwidth, 1920);
	if (this.width != cwidth) {
		this.exception('invalid_width', this.width);
	}
	var cheight = this.height || 0;
	var cheight = cMath.clamp(1, this.height, 1920);
	if (this.height != cheight) {
		this.exception('invalid_height', this.height);
	}
	// Some variables
	this.need_redraw = false;
	// Our canvas
	this.cCanvas = new Ccanvas({
		width : this.width,
		height : this.height
	});
	this.cCanvas.clear(new Ccolor());

	// Our layer manager
	this.layer_manager = new Clayer_manager({
		parent : this
	});
	this.layer_manager.add(new Clayer({
		parent : this.layer_manager,
		label : E_LAYERLABEL.mouse,
		width : this.width,
		height : this.height
	}));
	this.layer_manager.add(new Clayer({
		parent : this.layer_manager,
		label : E_LAYERLABEL.prefrag,
		width : this.width,
		height : this.height
	}));
	this.layer_manager.add(new Clayer({
		parent : this.layer_manager,
		width : this.width,
		height : this.height
	}));
	this.layer_manager.select(this.layer_manager.layers[0]);
	this.bind_trigger(this.layer_manager, 'update', function(e, d) {
		if (SHOJS_DEBUG > 4) console.log('[Trigger/received]', e.type);
		that.redraw(1);
	});
	// Our mouse
	this.cMouse = new Cmouse_tracker({
		parent : this,
		callback_move : function() {
			console.log('mouse move');
		},
		callback_track : function(x, y) {
			$(that.cMouse.rootElm).find('.var-x').empty().append(x);
			$(that.cMouse.rootElm).find('.var-y').empty().append(y);
		}
	});
	// Our grid
	this.cGrid = new Cgrid({
		parent : this,
		callback_slide : function(value) {
			this.set(value);
			console.log('slide');
			this.send_trigger('update');
		},
		callback_change : function(value) {
			this.set(value);
			console.log('Change');
			this.send_trigger('update');
		}
	});
	this.bind_trigger(this.cGrid, 'update', function(e, d) {
		if (SHOJS_DEBUG > 4) console.log('[Trigger/received]', e.type);
		that.update_grid();
	});
	// Surface is waiting surface update to redraw
	this.bind_trigger(this, 'update', function(e, d) {
		that.redraw(1);
	});
	// show
	this.bind_trigger(this, 'show', function(e, d) {
		if (!d) {
			widget_factory(that.dom_get(), {
				width : that.cCanvas.get_width() + 100,
				// height: that.cCanvas.height + 100,
				zIndex : 0,
				stack : true
			}).show();
		}
	});

	this.update_grid();
	return this;
}

Csurface.prototype = Object.create(Cobject.prototype);
Csurface.prototype.constructor = new Cobject();

/**
 * @param layer
 */
Csurface.prototype.set_current_layer = function(layer) {
	this.layer_manager.select(layer);
};

Csurface.prototype.update_grid = function() {
	var grid = this.layer_manager.get('grid');
	var ctx = grid.cCanvas.getContext();
	ctx.clearRect(0, 0, grid.cCanvas.data.width, grid.cCanvas.data.height);
	if (this.cGrid.get_parameter('visibility')) {
		this.cGrid.draw(grid.cCanvas.data, 0, 0, this.cCanvas.data.width,
				this.cCanvas.data.height);
	}
	this.need_redraw = true;
	this.send_trigger('update');
};
/**
 * @returns {Csurface}
 */
Csurface.prototype.dom_build = function() {
	var that = this;
	var r = $('<div title="(Ctrl-z) Undo"/>');

	r.addClass('surface');
	var g = $('<div/>');
	var canvas = this.cCanvas.data;
	var c = $(canvas);
	c.width = this.width;
	c.height = this.height;
	c.addClass('canvas');
	c.attr('tabindex', 0); // So we can get focus and bind ctrl-z
	c.mousedown(function(e) {
		that.callback_mousedown(e, that);
	});
	c.mouseup(function(e) {
		that.callback_mouseup(e, that);
	});
	c.mousemove(function(e) {
		that.callback_mousemove(e, that);
	});
	c.mouseout(function(e) {
		if (that.cMouse.is_pushed()) {
			that.cMouse.paused = true;
		}
	});
	c.mouseover(function(e) {
		if (that.cMouse.is_pushed()) {
			that.cMouse.paused = false;
		}
	});
	c.mouseenter(function(e) {
		that.send_trigger('surface_selected', that);
	});
	g.append(c);
	r.append(g);
	r.append(g);

	this.rootElm = r;
	return this;
};

/**
 * 
 */
Csurface.prototype.undo = function() {
	this.layer_manager.selected.discard_frag();
	this.layer_manager.selected.redraw();
	this.redraw(true);
};

/**
 * Redraw our surface We are stacking layers below and on top of current
 * selected layer so our rendering process a finite number of layers - bottom -
 * selected - prefrag - up - grid
 * 
 * @param force
 * @returns {Boolean}
 */
Csurface.prototype.redraw = function(force, dcanvas) {
	if (!this.need_redraw && !force) {
		return false;
	}
	var layer_manager = this.layer_manager;
	var selected = layer_manager.get();
	if (!selected) {
		console.warn('No layer selected');
		return false;
	}
	var canvas = this.cCanvas.data;
	var tctx = canvas.getContext('2d');
	tctx.save();
	var zoom = this.get_parameter('zoom');
	if (zoom != 0) {
		tctx.translate(canvas.width / 2, canvas.height / 2);
		tctx.scale(zoom, zoom);
	}
	tctx.clearRect(0, 0, canvas.width, canvas.height);
	// Drawing layer stack down
	if (this.layer_manager.special_layers.stack_down != undefined) {
		tctx.drawImage(
				this.layer_manager.special_layers.stack_down.cCanvas.data, 0,
				0, canvas.width, canvas.height);
	}
	// Drawing selected layer
	this.layer_manager.selected.redraw(force);
	tctx.drawImage(this.layer_manager.selected.cCanvas.data, 0, 0,
			canvas.width, canvas.height);

	// Drawing prefrag layer
	if ('down_composite_operation' in this.layer_manager.special_layers.prefrag) {
		tctx.globalCompositeOperation = this.layer_manager.special_layers.prefrag.down_composite_operation;
	}
	tctx.drawImage(this.layer_manager.special_layers.prefrag.cCanvas.data, 0,
			0, canvas.width, canvas.height);
	if ('down_composite_operation' in this.layer_manager.special_layers.prefrag) {
		tctx.globalCompositeOperation = 'source-over';
	}
	// Drawing layer stack up
	if (this.layer_manager.special_layers.stack_up != undefined) {
		tctx.drawImage(this.layer_manager.special_layers.stack_up.cCanvas.data,
				0, 0, canvas.width, canvas.height);
	}
	// Drawing grid
	if ('cGrid' in this && this.cGrid.isVisible) {
		tctx.drawImage(this.layer_manager.special_layers.grid.cCanvas.data, 0,
				0, canvas.width, canvas.height);
	}

	tctx.restore();
	this.send_trigger('redraw_preview', this);
	this.need_redraw = false;
	return true;
};

/**
 * 
 */
Csurface.prototype.clear = function() {
	for ( var i = 0; i < this.layer_manager.layers.length; i++) {
		this.layer_manager.layers[i].clear();
	}
	this.need_redraw = true;
	this.send_trigger('update');
};

/**
 * Returning width
 * 
 * @return {width] Ccanvas width
 */
Csurface.prototype.get_width = function() {
	return this.cCanvas.data.width;
};

/**
 * Returning height
 * 
 * @returns {height} Ccanvas height
 */
Csurface.prototype.get_height = function() {
	return this.cCanvas.data.height;
};

/**
 * @param e
 * @param obj
 * @returns {Boolean}
 */
Csurface.prototype.callback_mousedown = function(e, obj) {
	if (this.cMouse.is_pushed()) {
		console.warn("Mouse already pushed");
		return false;
	}
	this.cMouse.push();
	this.cGraphit.cGrapher.start();
	return true;
};

/**
 * @param e
 * @param obj
 * @returns {Boolean}
 */
Csurface.prototype.callback_mouseup = function(e, obj) {
	if (!this.cMouse.is_pushed()) {
		console.warn('Mouse not pushed');
		return false;

	}
	this.cGraphit.cGrapher.stop();
	this.redraw(true);
	this.cMouse.release();
	return true;
};

/**
 * @param e
 * @param obj
 */
Csurface.prototype.callback_mousemove = function(e, obj) {
	var $o = $(obj.cCanvas.data).offset();
	this.cMouse.move(e.pageX - $o.left, e.pageY - $o.top);
};

/**
 *
 */
Csurface.prototype.attach_graphit = function(cGraphit) {
	if (!cGraphit || !(cGraphit instanceof Cgraphit)) {
		console.error('Can\'t attach null or none Ctoolbox instance');
		return false;
	}
	this.cGraphit = cGraphit;
};

/**
 * @returns {___anonymous5807_5851}
 */
Csurface.prototype.save_as_json = function() {
	// var data = {
	// label : this.label,
	// layers : [],
	// };
	// for ( var i = 0; i < this.layer_manager.layers.length; i++) {
	// data.layers.push(this.layer_manager.layers[i].to_json());
	// }
	var w = window.open(this.cCanvas.data.toDataURL());
	return data;
};
