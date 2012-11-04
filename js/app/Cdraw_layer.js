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

Cdraw_layer.prototype.redraw = function() {
	if (!this.need_redraw) {
		return false;
	}
	for ( var i = this.frags.length - 1; i >= 0; i--) {
		var f = this.frags[i];
		this.ctx.drawImage(f.canvas, 0, 0, f.canvas.width, f.canvas.height,
				f.x, f.y, f.canvas.width, f.canvas.height);
	}
	this.need_redraw = false;
	return true;
};

Cdraw_layer.prototype.get_canvas = function() {
	this.redraw();
	return this.canvas;
};

Cdraw_layer.prototype.drawImage = function(canvas, sx, sy, swidth, sheight, tx,
		ty) {
	var frag = new Cdraw_frag(this, swidth, sheight);
	frag.drawImage(canvas, sx, sy, swidth, sheight, tx, ty);
	this.frags.push(frag);
};