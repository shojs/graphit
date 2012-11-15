/*******************************************************************************
 * Fragment are images who composed layer global image
 * 
 * @param parent
 * @param width
 * @param height
 */
function Cdraw_frag(parent, position, width, height) {
	this.position = position;
	this.cCanvas = new Ccanvas(width, height, new Ccolor(0,0,0,0));
};

Cdraw_frag.prototype.getContext = function(t) {
	return this.cCanvas.getContext('2d');
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
	var dctx = canvas.getContext('2d');
	this.cCanvas.ctx.drawImage(canvas, sx, sy, swidth, sheight, 0, 0, this.cCanvas.data.width,
				this.cCanvas.data.height);
	return true;
};

