

function helper_draw_surface(obj, x, y) {
	//console.log('Mouse x/y: ' + x + ' / ' + y);
}

function Cdraw_buttons(parent) {
	this.parent = parent;
	this.build();
	this.rootElm;
}

Cdraw_buttons.prototype.build = function() {
	var that = this;
	var root = document.createElement('button');
	var $r = $(root);
	$r.button({label: 'clear'});
	$r.click(function() {
		var msg = document.createElement('div');
		var $m = $(msg);
		$m.append('<p>Dou you want to clear your drawing ?</p>');
		$m.dialog({ 
			buttons: { 
				Ok: function() {
					console.log('OK');
					that.parent.clear();
					$( this ).dialog( "close" );
				},
				Cancel: function() { $( this ).dialog( "close" ); }
			}
		});
	});
	this.rootElm = root;
};

Cdraw_buttons.prototype.get_dom = function() {
	return this.rootElm;
};
/**
 * 
 * @param width
 * @param height
 * @returns
 */
function Cdraw_surface(id, width, height) {
	this.id = id;
	this.width = width;
	this.height = height;
	this.layer_mouse = new Cdraw_layer(this, E_LAYERLABEL.mouse);
	this.layer_grid = new Cdraw_layer(this, E_LAYERLABEL.grid);
	this.layer_prefrag = new Cdraw_layer(this, E_LAYERLABEL.prefrag);
	this.layers = new Array();
	var l0 = this.add_layer();
	this.set_current_layer(l0);
	this.mouse = new Cmouse_tracker(this, callback_stub, callback_stub, callback_stub, helper_draw_surface);
	this.rootElm = null;
	this.canvas = null;
	this.tools = null;
	this.cGraph = null;
	this.build();
}

Cdraw_surface.prototype.set_current_layer = function(layer) {
	this.layer_current = layer;
};

Cdraw_surface.prototype.get_layer = function(label) {
	if (!label || label == E_LAYERLABEL.current)
		return this.layer_current;
	if (isInt(label)) {
		return this.layers[label];
	}
	if (label == E_LAYERLABEL.mouse)
		return this.layer_mouse;
	if (label == E_LAYERLABEL.grid)
		return this.layer_grid;
};

Cdraw_surface.prototype.add_layer = function() {
	var layer = new Cdraw_layer(this, this.layers.length);
	this.layers.push(layer);
	return layer;
};

Cdraw_surface.prototype.build = function() {
	var that = this;
	var root = document.createElement('div');
	var $r = $(root);
	$r.attr('id', this.id);
	$r.addClass('surface-group draggable');
	$r.css('width', (this.width + 100));
	$r.css('height', (this.height + 100));
	$r.append('<h6 class="header">surface</h6>');
	var canvas = document.createElement('canvas');
	this.canvas = canvas;
	var $c = $(canvas);
	$c.attr('id', 'graphing-area');
	$c.attr('width', this.width);
	$c.attr('height', this.height);
	$c.addClass('draw-surface not-draggable');
	$c.mousedown(function(e) { that.callback_mousedown(e, that); });
	$c.mouseup(function(e) { that.callback_mouseup(e, that); });
	$c.mousemove(function(e) { that.callback_mousemove(e, that); });
	$c.mouseout(function(e) { that.callback_mouseup(e, that); });
	this.dom_mouse = this.mouse.get_dom();
	$r.append($c);
	this.build_buttons = new Cdraw_buttons(this);
	$r.append(this.build_buttons.get_dom());
	//$r.unbind('keydown', 'Ctrl+z');
	$(document).bind('keydown', 'Ctrl+z', function() { that.undo();});
	this.rootElm = $(root);
};



Cdraw_surface.prototype.undo = function() {
	console.log('----- ----- -----' + "\n" + 'Undo');
	this.layer_current.discard_frag();
	this.layer_current.redraw();

	this.redraw();
};

Cdraw_surface.prototype.redraw = function() {
	//console.log('Redrawing surface');
	var tctx = this.canvas.getContext('2d');
	tctx.clearRect(0,0, this.canvas.width, this.canvas.height);
	for (var i = 0; i < this.layers.length; i++) {
		this.layers[i].redraw();
		tctx.drawImage(this.layers[i].canvas, 0, 0, this.canvas.width, this.canvas.height);
	}
	tctx.drawImage(this.layer_prefrag.canvas, 0, 0, this.canvas.width, this.canvas.height);
	tctx.drawImage(this.layer_mouse.canvas, 0, 0, this.canvas.width, this.canvas.height);
};

Cdraw_surface.prototype.clear = function() {
	//this.layer_current.clear();
	for (var i = 0; i < this.layers.length; i++) {
		this.layers[i].clear();
	}
	this.redraw();
};

Cdraw_surface.prototype.callback_mousedown = function(e, obj) {
	console.log('----- ----- -----' + "\n" + this.id + ': mouse down');
	this.mouse.push();
	this.cGrapher.start();
};

Cdraw_surface.prototype.callback_mouseup = function(e, obj) {
	console.log(this.id + ': mouse up');
	this.cGrapher.stop();
	this.redraw();
	this.mouse.release();

	
};

Cdraw_surface.prototype.callback_mousemove = function(e, obj) {
	//var dsize = obj.tools.size / 2;
	var $o = $(obj.canvas).offset();
	this.mouse.move(e.pageX - $o.left, e.pageY - $o.top); 
	var $d = $(this.dom_mouse).children('div').children('div.hold-var').children('div.var-x');
	$d.empty();
	$d.append(this.mouse.x);
	$d = $(this.dom_mouse).children('div').children('div.hold-var').children('div.var-y');
	$d.empty();
	$d.append(this.mouse.y);
};

Cdraw_surface.prototype.get_dom = function() {
	return this.rootElm;
};