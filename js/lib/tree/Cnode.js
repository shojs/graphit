/**
 * Class  Cnode
 * 18:44:03 / 4 déc. 2012 [jsgraph] sho 
 */
function Cnode(options, mandatory) {
	options = options || {};
	options.className = options.className || "Cnode";
	options.label = options.label || "Cnode";
	options.childs = [];
	Cobject.call(this, options, mandatory);	
	
}

/* Inheritance */
Cnode.prototype = Object.create(Cobject.prototype);
Cnode.prototype.constructor = new Cobject();


/**
 *
 */
Cnode.prototype.node_traverse_down = function(callback) {
	callback.call(this);
	for(var i = 0; i < this.childs.length; i++) {
		this.childs.node_traverse_down(callback);
	}
};


/**
*
*/
Cnode.prototype.node_traverse_up = function(callback) {
	for(var i = 0; i < this.childs.length; i++) {
		this.childs.node_traverse_up(callback);
	}
	callback.call(this);
};


