/**
 * Class  Cnode_canvas
 * 18:51:10 / 4 déc. 2012 [jsgraph] sho 
 */
function Cnode_canvas(options) {
	options = options || {};
	options.className = options.className || "Cnode_canvas";
	options.label = options.label || "Cnode_canvas";
	options.transform = new Ctransform2d();
	options.position = new Cvector2d(0,0);
	Cnode.call(this, options, ['parent', 'transform', 'position']);
	this.cCanvas = new Ccanvas(options);
}

/* Inheritance */
Cnode_canvas.prototype = Object.create(Cnode.prototype);
Cnode_canvas.prototype.constructor = new Cnode();