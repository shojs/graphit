/*******************************************************************************
 * 
 * @param obj
 * @param x
 * @param y
 */
function helper_draw_surface(obj, x, y) {
	// console.log('Mouse x/y: ' + x + ' / ' + y);
}

/*******************************************************************************
 * 
 * @param parent
 * @returns
 */
function Cdraw_buttons(parent) {
	this.parent = parent;
	this.build();
	this.rootElm;
}

Cdraw_buttons.prototype.build = function() {
	var that = this;
	var root = document.createElement('button');
	var $r = $(root);
	$r.button({
		label : 'clear'
	});
	$r.click(function() {
		var msg = document.createElement('div');
		var $m = $(msg);
		$m.append('<p>Dou you want to clear your drawing ?</p>');
		$m.dialog({
			buttons : {
				Ok : function() {
					console.log('OK');
					that.parent.clear();
					$(this).dialog("close");
				},
				Cancel : function() {
					$(this).dialog("close");
				}
			}
		});
	});
	this.rootElm = root;
};

Cdraw_buttons.prototype.get_dom = function() {
	return this.rootElm;
};

/*******************************************************************************
 * 
 * @param width
 * @param height
 * @returns
 */
function Cdraw_surface(id, width, height) {
	this.id = id;
	this.width = width;
	this.height = height;
	this.layer_manager = new Cdraw_layer_manager(this);
	this.layer_manager.add(new Cdraw_layer(this, E_LAYERLABEL.mouse));
	this.layer_manager.add(new Cdraw_layer(this, E_LAYERLABEL.prefrag));
//	this.layer_manager.add(new Cdraw_layer(this));
	this.layer_manager.add(new Cdraw_layer(this));
	this.mouse = new Cmouse_tracker(this, callback_stub, callback_stub,
			callback_stub, helper_draw_surface);
	this.rootElm = null;
	this.canvas = new Ccanvas(this.width, this.height);
	this.cTools = null;
	this.cGraph = null;
	this.build();
}

Cdraw_surface.prototype.set_current_layer = function(layer) {
	this.layer_manager.current_layer = layer;
};

Cdraw_surface.prototype.build = function() {
	var that = this;
	var root = document.createElement('div');
	var $r = $(root);
	$r.attr('id', this.id);
	$r.addClass('surface-group draggable ui-widget-content ui-widget');
	$r.css('width', (this.width + 100));
	$r.css('height', (this.height + 100));
	$r.append('<h6 class="header ui-widget-header">surface</h6>');
	var canvas = this.canvas.canvas;
	var $c = $(canvas);
	$c.attr('id', 'graphing-area');
	$c.attr('width', this.width);
	$c.attr('height', this.height);
	$c.addClass('draw-surface not-draggable');
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
			that.callback_mouseup(e, that);
		}
	});
	this.dom_mouse = this.mouse.get_dom();
	$r.append($c);
	this.build_buttons = new Cdraw_buttons(this);
	$r.append(this.build_buttons.get_dom());
	// $r.unbind('keydown', 'Ctrl+z');
	$(document).bind('keydown', 'Ctrl+z', function() {
		that.undo();
	});
	this.rootElm = $(root);
};

Cdraw_surface.prototype.undo = function() {
	//console.log('----- ----- -----' + "\n" + 'Undo');
	this.layer_manager.current_layer.discard_frag();
	this.layer_manager.current_layer.redraw();

	this.redraw();
};

Cdraw_surface.prototype.redraw = function() {
	var canvas = this.canvas.canvas;
	var tctx = canvas.getContext('2d');
	tctx.clearRect(0, 0, canvas.width, canvas.height);
	for ( var i = 0; i < this.layer_manager.layers.length; i++) {
		this.layer_manager.layers[i].redraw(true);
		tctx.drawImage(this.layer_manager.layers[i].canvas, 0, 0,
				canvas.width, canvas.height);
	}
	tctx.drawImage(this.layer_manager.special_layers.prefrag.canvas, 0, 0,
			canvas.width, canvas.height);
	tctx.drawImage(this.layer_manager.special_layers.prefrag.canvas, 0, 0,
			canvas.width, this.canvas);
};

Cdraw_surface.prototype.clear = function() {
	for ( var i = 0; i < this.layer_manager.layers.length; i++) {
		this.layer_manager.layers[i].clear();
	}
	this.redraw();
};

Cdraw_surface.prototype.callback_mousedown = function(e, obj) {
	if (this.mouse.is_pushed()) {
		console.warn("Mouse already pushed");
		return false;
	}
	this.mouse.push();
	this.cGrapher.start();
	return true;
};

Cdraw_surface.prototype.callback_mouseup = function(e, obj) {
	if (!this.mouse.is_pushed()) {
		console.warn('Mouse not pushed');
		return false;
	}
	this.cGrapher.stop();
	this.redraw();
	this.mouse.release();
	return true;
};

Cdraw_surface.prototype.callback_mousemove = function(e, obj) {
	// var dsize = obj.tools.size / 2;
	var $o = $(obj.canvas.canvas).offset();
	this.mouse.move(e.pageX - $o.left, e.pageY - $o.top);
	var $d = $(this.dom_mouse).children('div').children('div.hold-var')
			.children('div.var-x');
	$d.empty();
	$d.append(this.mouse.x);
	$d = $(this.dom_mouse).children('div').children('div.hold-var').children(
			'div.var-y');
	$d.empty();
	$d.append(this.mouse.y);
};

Cdraw_surface.prototype.get_dom = function() {
	return this.rootElm;
};