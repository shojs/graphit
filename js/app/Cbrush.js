/**
 * Class  Cbrush
 * [jsgraph] 22 nov. 2012
 */

var Ebrush_type = {
		js: 1,
		gbr: 2,
};

function Cbrush(options) {
	options.className = "Cbrush";
	options.label = "brush";
	Cobject.call(this, options, ['name', 'type']);
}

/* Inheritance */
Cbrush.prototype = Object.create(Cobject.prototype);
Cbrush.prototype.constructor = new Cobject();

/**
 *
 */
Cbrush.prototype.init = function(options) {
	console.log('Adding brush', this.type, this.name);
	if (!this.type || !this.name) {
		console.error("Cbrush need <<type>> and <<name>> parameter");
		return false;
	}
	if (this.type == Ebrush_type.js) {
		this._load_js(options);
	} else if (this.type == Ebrush_type.gbr) {
		console.log('Parsing Gimp Brush');
		this._load_gbr(options);
	} else {
		console.error('Unknow Cbrush type', this.type);
		return false;
	}
	return true;
};

/**
 *
 */
Cbrush.prototype._load_js = function(options) {
	console.log('Parsing javascript brush');
	if (!('update' in this.callback)) {
		
	}
};

/**
 *
 */
Cbrush.prototype._load_gbr = function(dumbopt) {
	// dumb comment
};