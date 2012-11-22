/*******************************************************************************
 * Fragment are images who composed layer global image
 * 
 * @param parent
 * @param width
 * @param height
 */
function Cfrag(options) {
    	options.className = 'Cfrag';
    	options.label = 'frag';
    	Cobject.call(this, options, ['parent', 'position', 'width', 'height', 'color']);
    	if (!this.color) this.color = new Ccolor(0,0,0,0);
	this.cCanvas = new Ccanvas({width: this.width, height: this.height, bg_color: this.color});
	this.ctx = this.getContext();
};

Cfrag.prototype = Object.create(Cobject.prototype);

Cfrag.prototype.constructor = new Cobject();

Cfrag.prototype.getContext = function(t) {
	return this.cCanvas.getContext('2d');
};

Cfrag.prototype.drawImage = function(source, sx, sy, swidth, sheight, tx, ty) {
    	var dcanvas = this.cCanvas.data;
    	var ctx = this.cCanvas.data.getContext('2d');
    	//console.log('frag src', source.toDataURL());
    	try {
    	    ctx.drawImage(source, 
		sx, sy, swidth, sheight, 
		0, 0, dcanvas.width, dcanvas.height);
    	} catch (e) {
    	    console.error('Cannot draw to fragment', e);
    	    return false;
    	}
	return true;
};

