/**
 * 
 */
var E_LAYERLABEL = new Object({
	current : 1,
	mouse : 2,
	grid : 3,
	prefrag: 4,
});

function helper_draw_surface(obj, x, y) {
	//console.log('Mouse x/y: ' + x + ' / ' + y);
}
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
	this.set_current_layer(this.layer_grid);
	this.mouse = new Cmouse_tracker(callback_stub, callback_stub, callback_stub, helper_draw_surface);
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
	var layer = new Cdraw_layer(this, 'layer');
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
	this.dom_mouse = this.mouse.get_dom();
	console.log(this.dom_mouse);
	$r.append($c);
	this.rootElm = $(root);
};

Cdraw_surface.prototype.callback_mousedown = function(e, obj) {
	console.log(this.id + ': mouse down');
	this.mouse.push();
	this.cGrapher.start();
};

Cdraw_surface.prototype.callback_mouseup = function(e, obj) {
	console.log(this.id + ': mouse up');
	this.mouse.release();
	this.cGrapher.stop();
};

Cdraw_surface.prototype.callback_mousemove = function(e, obj) {
	var dsize = obj.tools.size / 2;
//	obj.mouse.x-=dsize;
//	obj.mouse.y-=dsize;
	//console.log(this.id + ': mouse move');
	//console.log(e.pageX);
	//console.log('Offset left: ' + obj.canvas.offsetLeft);
	var $o = $(obj.canvas).offset();
	this.mouse.move(e.pageX - $o.left + dsize, e.pageY - $o.top + dsize); 
	var $d = $(this.dom_mouse).children('div').children('div.hold-var').children('div.var-x');
	$d.empty();
	$d.append(this.mouse.x);
	$d = $(this.dom_mouse).children('div').children('div.hold-var').children('div.var-y');
	$d.empty();
	$d.append(this.mouse.x);
};

Cdraw_surface.prototype.get_dom = function() {
	return this.rootElm;
};