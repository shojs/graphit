/**
 * Class  Cglobal_context
 * 07:20:40 / 8 déc. 2012 [Graphit Nosferat.us] sho 
 */
function Cglobal_context(options) {
	options = options || {};
	options.className = "Cglobal_context";
	options.label = "Cglobal_context";
	Cobject.call(this, options, []);
	Cglobal_context.context = null;
	Cglobal_context.has_changed = false;
}

/* Inheritance */
Cglobal_context.prototype = Object.create(Cobject.prototype);
Cglobal_context.prototype.constructor = new Cobject();

/**
 *
 */
Cglobal_context.prototype.set_has_changed = function(b) {
	Cglobal_context.has_changed = b;
};

/**
 *
 */
Cglobal_context.prototype.set_context = function(context) {
	if (context == Cglobal_context.context) {
		this.set_has_changed(false);
		return false;
	}
	Cglobal_context.context = { canvas: context, ctx: canvas.getContext('2d') };
	this.set_has_changed(true);
	return true;
};

/**
 *
 */
Cglobal_context.prototype.get_context = function() {
	return Cglobal_context.context;
};


/**
 *
 */
Cglobal_context.prototype.clear = function(dumbopt) {
	this.context.ctx.clearRect(this.context.canvas.width, this.context.canvas.height);
};

window.graphit.context = new Cglobal_context();