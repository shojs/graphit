/**
 * Class  Cdraw
 * 07:19:50 / 8 déc. 2012 [Graphit Nosferat.us] sho 
 */
function Cdraw(options) {
	options = options || {};
	options.className = "Cdraw";
	options.label = "Cdraw";
	Cobject.call(this, options, []);
}

/* Inheritance */
Cdraw.prototype = Object.create(Cobject.prototype);
Cdraw.prototype.constructor = new Cobject();

window.graphit.draw = new Cdraw();