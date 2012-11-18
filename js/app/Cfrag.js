/*******************************************************************************
 * Fragment are images who composed layer global image
 * 
 * @param parent
 * @param width
 * @param height
 */
function Cfrag(parent, position, width, height) {
	this.position = position;
	this.cCanvas = new Ccanvas(width, height, new Ccolor(0,0,0,0));
	this.ctx = this.getContext();
};

Cfrag.prototype.getContext = function(t) {
	return this.cCanvas.getContext('2d');
};

Cfrag.prototype.drawImage = function(canvas, sx, sy, swidth, sheight, tx,
		ty) {
    	var dcanvas = this.cCanvas.data;
    	if (sx < 0 || sx > dcanvas.width) {
    	    console.error('sx out of bound', sx);
    	    cMath.clamp(0, sx, dcanvas.width);
    	}
    	if (sy < 0 || sy > dcanvas.height) {
    	    console.error('sy out of bound', sy);
    	    cMath.clamp(0, sy, dcanvas.height);
    	}
    	var dctx = canvas.getContext('2d');
    	try {
	this.cCanvas.ctx.drawImage(canvas, 
		sx, sy, swidth, sheight, 
		0, 0, dcanvas.width, dcanvas.height);
    	} catch (e) {
    	    console.error('Cannot draw to fragment', e);
    	    return false;
    	}
	return true;
};

