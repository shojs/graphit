/*******************************************************************************
 * 
 */
var E_DRAWCOMPOSITION = new Object({
	'source-in' : 'source-in',
	'source-over' : 'source-over',

});

/*******************************************************************************
 * 
 * @param parent
 * @param label
 * @returns
 */
function Cdraw_layer(parent, label, p_composition) {
	var composition = p_composition;
	if (!composition) {
		composition = 'source-over';
	}
	this.composition = composition;
	this.parent = parent;
	this.label = label;
	this.frags = new Array();
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width', parent.width);
	this.canvas.setAttribute('height', parent.height);
	this.ctx = this.canvas.getContext('2d');
	this.need_redraw = true;
};

Cdraw_layer.prototype.discard_frag = function() {
	console.log('length: ' + this.frags.length);
	this.need_redraw = true;
	return this.frags.pop();
};

Cdraw_layer.prototype.dom_build = function() {
	var root = document.createElement('div');
	var $r = $(root);
	$r.addClass('layers draggable');
	$r.append('<h6>Layers</h6>');
	var group = document.createElement('div');
	var $g = $(group);
	$g.addClass('group');
	$r.append($g);
	this.rootElm = $r;
};

Cdraw_layer.prototype.redraw = function() {
	if (!this.need_redraw) {
		return false;
	}
	// this.clear();
	this.ctx.globalCompositeOperation = this.composition;
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	// $('#frags-preview').empty();
	// for ( var i = this.frags.length - 1; i >= 0; i--) {
	for ( var i = 0; i < this.frags.length; i++) {
		var f = this.frags[i];
		this.ctx.drawImage(f.canvas, 0, 0, f.canvas.width, f.canvas.height,
				f.position.x, f.position.y, f.canvas.width, f.canvas.height);
	}
	this.need_redraw = false;
	return true;
};

Cdraw_layer.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.frags = new Array();
};

Cdraw_layer.prototype.get_canvas = function() {
	this.redraw();
	return this.canvas;
};

Cdraw_layer.prototype.drawImage = function(canvas, sx, sy, swidth, sheight, tx,
		ty) {
	var frag = new Cdraw_frag(this, new Object({
		x : sx,
		y : sy
	}), swidth, sheight);
	frag.drawImage(canvas, sx, sy, swidth, sheight, tx, ty);
	this.frags.push(frag);
	try {
		this.ctx.drawImage(canvas, sx, sy, swidth, sheight, sx, sy, swidth,
				sheight);
	} catch (e) {
		console.error(e);
	}
	;
};

/*******************************************************************************
 * 
 * @returns
 */
function Cdraw_layer_manager() {
	this.layers = new Array();
	this.special_layers = new Object();
	this.current_layer = null;
};

Cdraw_layer_manager.prototype.add = function(layer) {
	if (!(layer instanceof Cdraw_layer)) {
		console.error('Layer manager need Cdraw_layer object');
		return false;
	}
	var reg = new RegExp(/^_(.*)/);
	var match = reg.exec(layer.label);
	if (match) {
		console.log('add special: ' + match[1]);
		layer.label = 'layer-' + match[1];
		this.special_layers[match[1]] = layer;
	} else {
		layer.label = 'layer-' + this.layers.length;
		console.log('add: ' + layer.label);
		this.layers.push(layer);
	}
	this.current_layer = layer;
	return true;
};
