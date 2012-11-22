/**
 * Class  Cbrush_manager
 * [jsgraph] 22 nov. 2012
 */
function Cbrush_manager(options) {
	options = options ||  {};
	options.className = "Cbrush_manager";
	options.label = "brushmanager";
	this.brushes = [];
	Cobject.call(this, options, []);

}

/* Inheritance */
Cbrush_manager.prototype = Object.create(Cobject.prototype);
Cbrush_manager.prototype.constructor = new Cobject();

/**
 *
 */
Cbrush_manager.prototype.init = function(options, permitted) {
	this.add(new Cbrush({ type: 'js', name: 'circle', data: CTOOL_brushes.circle}));
};

/**
 *
 */
Cbrush_manager.prototype.dom_build = function() {
	var that = this;
	var r = $('<div />');
	r.attr('id', this.guid());
	r.attr('title', this.label);
	var g = $('<div />');
	g.append('<p>plop</p>');
	r.append(g);
	this.rootElm = r;
	return this;
};

/**
 *
 */
Cbrush_manager.prototype.add = function(cBrush) {
	if (this.exists(cBrush)) {
		console.error('This brush is already present');
		return false;
	}
	this.brushes.push(cBrush);
	return true;
};

/**
 *
 */
Cbrush_manager.prototype.exists = function(cBrush) {
	for (var i = 0; i < this.brushes.length; i++) {
		var brush = this.brushes[i];
		if (brush.type == cBrush.type && brush.name == cBrush.name) {
			return true;
		}
	}
	return false;
};