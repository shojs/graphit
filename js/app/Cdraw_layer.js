/**
 * 
 * @param parent
 * @param label
 * @returns
 */
function Cdraw_layer(parent, label) {
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

Cdraw_layer.prototype.redraw = function() {
	if (!this.need_redraw) {
		return false;
	}
	//this.clear();
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	//$('#frags-preview').empty();
	//for ( var i = this.frags.length - 1; i >= 0; i--) {
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
	var frag = new Cdraw_frag(this, new Object({x: sx, y: sy}), swidth, sheight);
	frag.drawImage(canvas, sx, sy, swidth, sheight, tx, ty);
	this.frags.push(frag);
	try {
		this.ctx.drawImage(canvas, sx, sy, swidth, sheight, sx, sy, swidth, sheight);
	} catch(e) {
		console.error(e);
	};
};