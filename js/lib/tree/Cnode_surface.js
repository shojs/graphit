/**
 * Class  Cnode_surface
 * 19:00:02 / 4 déc. 2012 [jsgraph] sho 
 */
function Cnode_surface(options) {
	options = options || {};
	options.className = options.className || "Cnode_surface";
	options.label = options.label || "Cnode_surface";
	Cnode_canvas.call(this, options, []);
}

/* Inheritance */
Cnode_surface.prototype = Object.create(Cnode_canvas.prototype);
Cnode_surface.prototype.constructor = new Cnode_canvas();