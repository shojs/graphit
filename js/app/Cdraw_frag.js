/**
 * Fragment are images who composed layer global image
 * 
 * @param parent
 * @param width
 * @param height
 */
function Cdraw_frag(parent, position, width, height) {
	this.position = position;
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width', width);
	this.canvas.setAttribute('height', height);
	this.ctx = this.canvas.getContext('2d');
};

Cdraw_frag.prototype.drawImage = function(canvas, sx, sy, swidth, sheight, tx,
		ty) {
	var ctx = canvas.getContext('2d');
	if (tx > swidth || tx < 0) {
		console.error('x position out of bound');
		return false;
	} else if (ty > sheight || ty < 0) {
		console.error('y position out of bound');
		return false;
	}
	var g = new Object({
		canvas_frag: this.canvas,
		canvas_source: canvas,
		sx: sx,
		sy: sy,
		swidth: swidth,
		sheight: sheight,
		tx: tx,
		ty: ty,
	});
	console.log(g, this.canvas, canvas);
	this.ctx.drawImage(canvas, sx, sy, swidth, sheight, 0, 0, swidth, sheight);
	return true;
};