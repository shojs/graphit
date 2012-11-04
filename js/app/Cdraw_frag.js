/**
 * Fragment are images who composed layer global image
 * 
 * @param parent
 * @param width
 * @param height
 */
function Cdraw_frag(parent, width, height) {
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width', width);
	this.canvas.setAttribute('height', height);
	this.ctx = this.canvas.getContext('2d');
	this.x = null;
	this.y = null;
};

Cdraw_frag.prototype.drawImage = function(canvas, sx, sy, swidth, sheight, tx,
		ty) {
	if (tx > swidth || tx < 0) {
		console.error('x position out of bound');
		return false;
	} else if (ty > sheight || ty < 0) {
		console.error('y position out of bound');
		return false;
	}
	this.x = tx;
	this.y = ty;
	this.ctx
			.drawImage(canvas, sx, sy, swidth, sheight, tx, ty, swidth, sheight);
	return true;
};