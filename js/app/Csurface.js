/*******************************************************************************
 * 
 * @param width
 * @param height
 * @returns
 */
function Csurface(id, width, height) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.cCanvas = new Ccanvas(this.width, this.height);
    this.cTools = null;
    this.cGraph = null;
    this.need_redraw = false;
    this.layer_manager = new Clayer_manager(this);
    this.layer_manager.add(new Clayer(this.layer_manager, E_LAYERLABEL.mouse));
    this.layer_manager
	    .add(new Clayer(this.layer_manager, E_LAYERLABEL.prefrag));
    this.layer_manager.add(new Clayer(this.layer_manager));
    this.cCanvas.clear(new Ccolor(255, 0, 0, 1));
    this.mouse = new Cmouse_tracker(this, {
	callback_move : function() {
	    console.log('mouse move');
	},
	callback_track : function() {
	    console.log('mouse track');
	},
    });
    this.rootElm = null;
    this.need_redraw = true;
    this.layer_manager.select(this.layer_manager.layers[0]);
    this.build();

}

Csurface.prototype.set_current_layer = function(layer) {
    this.layer_manager.select(layer);
};

Csurface.prototype.build = function() {
    var that = this;
    var root = document.createElement('div');
    var $r = $(root);
    // $r.attr('title', 'surface');
    // $r.id = 'surface-id-01';
    $r.addClass('surface ' + DRAWGLOB.css_draggable_class);
    // var $d = $r.dialog({
    // width: 900,
    // height: 700,
    // resizable: true,
    // draggable: true,
    // title: 'Surface',
    // autoOpen: false,
    // });
    var $g = $(document.createElement('div'));
    helper_build_header($r, ' ', 'Surface');
    var canvas = this.cCanvas.data;
    var $c = $(canvas);
    $c.width = this.width;
    $c.height = this.height;
    // $c.attr('width', this.width);
    // $c.attr('height', this.height);
    $c.addClass('canvas not-draggable');
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
	if (that.mouse.is_pushed()) {
	    that.mouse.paused = true;
	    // that.callback_mouseup(e, that);
	}
    });
    $c.mouseover(function(e) {
	if (that.mouse.is_pushed()) {
	    that.mouse.paused = false;
	    // that.callback_mouseup(e, that);
	}
    });
    this.dom_mouse = this.mouse.get_dom();
    $g.append($c);
    $r.append($g);
    // this.build_buttons = new Cdraw_buttons(this);
    // $g = $(document.createElement('div'));
    // $g.append(this.build_buttons.get_dom());
    // TODO Putting back undo
    $(document).bind('keydown', 'Ctrl+z', function() {
	that.undo();
    });
    $r.append($g);
    // $d.dialog('open');
    this.rootElm = $r;
};

Csurface.prototype.undo = function() {
    this.layer_manager.selected.discard_frag();
    this.layer_manager.selected.redraw();
    this.redraw(true);
};

/**
 * Redraw our surface
 * We are stacking layers below and on top of current selected layer so our 
 * rendering process a finite number of layers
 * - bottom
 * - selected
 * - prefrag
 * - up
 * - grid
 * @param force
 * @returns {Boolean}
 */
Csurface.prototype.redraw = function(force) {
    if (!this.need_redraw && !force) {
	return false;
    }
    // var tool = this.cTools.selected;
    var canvas = this.cCanvas.data;
    var tctx = canvas.getContext('2d');
    tctx.save();
    tctx.clearRect(0, 0, canvas.width, canvas.height);
    // Drawing layer stack down
    if (this.layer_manager.special_layers.stack_down != undefined) {
	tctx.drawImage(this.layer_manager.special_layers.stack_down.canvas, 0,
		0, canvas.width, canvas.height);
    }
    // Drawing selected layer
    this.layer_manager.selected.redraw(force);
    tctx.drawImage(this.layer_manager.selected.canvas, 0, 0, canvas.width,
	    canvas.height);

    // Drawing prefrag layer
    if ('down_composite_operation' in this.layer_manager.special_layers.prefrag) {
	tctx.globalCompositeOperation = this.layer_manager.special_layers.prefrag.down_composite_operation;
    }
    tctx.drawImage(this.layer_manager.special_layers.prefrag.canvas, 0, 0,
	    canvas.width, canvas.height);
    if ('down_composite_operation' in this.layer_manager.special_layers.prefrag) {
	tctx.globalCompositeOperation = 'source-over';
    }
    // Drawing layer stack up
    if (this.layer_manager.special_layers.stack_up != undefined) {
	tctx.drawImage(this.layer_manager.special_layers.stack_up.canvas, 0, 0,
		canvas.width, canvas.height);
    }
    
    tctx.restore();
    this.need_redraw = false;
    return true;
};

Csurface.prototype.clear = function() {
    for ( var i = 0; i < this.layer_manager.layers.length; i++) {
	this.layer_manager.layers[i].clear();
    }
    this.redraw();
};

Csurface.prototype.callback_mousedown = function(e, obj) {
    if (this.mouse.is_pushed()) {
	console.warn("Mouse already pushed");
	return false;
    }
    this.mouse.push();
    this.cGrapher.start();
    return true;
};

Csurface.prototype.callback_mouseup = function(e, obj) {
    if (!this.mouse.is_pushed()) {
	console.warn('Mouse not pushed');
	return false;
    }
    this.cGrapher.stop();
    this.redraw(true);
    this.mouse.release();
    return true;
};

Csurface.prototype.callback_mousemove = function(e, obj) {
    var $o = $(obj.cCanvas.data).offset();
    this.mouse.move(e.pageX - $o.left, e.pageY - $o.top);
};

Csurface.prototype.get_dom = function() {
    return this.rootElm;
};

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