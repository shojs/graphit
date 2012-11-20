/*******************************************************************************
 * 
 * @param width
 * @param height
 * @returns
 */
function Csurface(id, width, height) {
    Cobject.call(this, {
	className: 'Csurface',
	width : width,
	height : height
    }, [ 'width', 'height' ]);
    console.log('-> Creating surface WxH', width, height);
    this.id = id;
    this.cCanvas = new Ccanvas({width: this.width, height: this.height});
    this.cTools = null;
    this.cGraph = null;
    this.label = 'Surface';
    this.className = 'Csurface';
    var that = this;

    this.need_redraw = false;
    this.layer_manager = new Clayer_manager(this);
    this.layer_manager.add(new Clayer(this.layer_manager, E_LAYERLABEL.mouse));
    this.layer_manager
	    .add(new Clayer(this.layer_manager, E_LAYERLABEL.prefrag));
    this.layer_manager.add(new Clayer(this.layer_manager));
    this.cCanvas.clear(new Ccolor(0, 0, 0, 1));
    var that = this;
    this.cMouse = new Cmouse_tracker({
	parent : this,
	callback_move : function() {
	    console.log('mouse move');
	},
	callback_track : function(x, y) {
	    $(that.cMouse.rootElm).find('.var-x').empty().append(x);
	    $(that.cMouse.rootElm).find('.var-y').empty().append(y);
	},
    });
    this.rootElm = null;
    this.need_redraw = true;
    this.layer_manager.select(this.layer_manager.layers[0]);

    $(document).bind('shojs-surface-update', function(e, d) {
	if (d == 'grid-option-change') {
	    that.update_grid();
	}
	that.redraw(true);
    });
    this.cGrid = new Cgrid({
	parent: this,
	callback_slide: function(value) {
	    this.set(value);
	    console.log('slide');
	    that.update_grid.call(that, this);
	},
	callback_change: function(value) {
	    this.set(value);
	    console.log('Change');
	    that.update_grid.call(that, this);
	}
    });

    this.update_grid();
    //this.dom_get();
}

Csurface.prototype = Object.create(Cobject.prototype);
Csurface.prototype.constructor = new Cobject();

/**
 * 
 * @param layer
 */
Csurface.prototype.set_current_layer = function(layer) {
    this.layer_manager.select(layer);
};

Csurface.prototype.update_grid = function() {
    var grid = this.layer_manager.get_layer('grid');
    var ctx = grid.getContext('2d');
    ctx.clearRect(0, 0, grid.cCanvas.data.width, grid.cCanvas.data.height);
    if (this.cGrid.get_parameter('visibility')) {
	this.cGrid.draw(grid.cCanvas.data,0,0,this.cCanvas.data.width, this.cCanvas.data.height);
    }
    this.redraw(true);
};
/**
 * 
 * @returns {Csurface}
 */
Csurface.prototype.dom_build = function() {
    var that = this;
    var r = $('<div title="Surface"/>');
    
    r.addClass('surface');
    var g = $('<div/>');
    var canvas = this.cCanvas.data;
    var $c = $(canvas);
    $c.width = this.width;
    $c.height = this.height;
    $c.addClass('canvas');
    $c.mousedown(function(e) {
	that.callback_mousedown(e, that);
    });
    $c.mouseup(function(e) {
	that.callback_mouseup(e, that);
    });
    $c.mousemove(function(e) {
	that.callback_mousemove(e, that);
    });
    $c.mouseout(function(e) {
	if (that.cMouse.is_pushed()) {
	    that.cMouse.paused = true;
	}
    });
    $c.mouseover(function(e) {
	if (that.cMouse.is_pushed()) {
	    that.cMouse.paused = false;
	}
    });
    g.append($c);
    r.append(g);
    // TODO Putting back undo
    $(document).bind('keydown', 'Ctrl+z', function() {
	that.undo();
    });
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
    var canvas = this.cCanvas.data;
    var tctx = canvas.getContext('2d');
    tctx.save();
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
	tctx.drawImage(this.layer_manager.special_layers.grid.cCanvas.data,
		0, 0, canvas.width, canvas.height);
    }
    tctx.restore();
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
    this.redraw();
};

/**
 * 
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
    this.cGrapher.start();
    return true;
};

/**
 * 
 * @param e
 * @param obj
 * @returns {Boolean}
 */
Csurface.prototype.callback_mouseup = function(e, obj) {
    if (!this.cMouse.is_pushed()) {
	console.warn('Mouse not pushed');
	return false;
    }
    this.cGrapher.stop();
    this.redraw(true);
    this.cMouse.release();
    return true;
};

/**
 * 
 * @param e
 * @param obj
 */
Csurface.prototype.callback_mousemove = function(e, obj) {
    var $o = $(obj.cCanvas.data).offset();
    this.cMouse.move(e.pageX - $o.left, e.pageY - $o.top);
};


/**
 * 
 * @returns {___anonymous5807_5851}
 */
Csurface.prototype.save_as_json = function() {

    var data = {
	label : this.label,
	layers : [],
    };
    for ( var i = 0; i < this.layer_manager.layers.length; i++) {
	data.layers.push(this.layer_manager.layers[i].to_json());
    }
    var w = window.open(this.cCanvas.data.toDataURL());
    // w.document.location.href=JSON.stringify(data);
    console.log(data);
    return data;
};