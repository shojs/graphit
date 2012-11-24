/**
 * Class  Cmenu
 * 06:40:06 / 24 nov. 2012 [jsgraph] sho 
 */
function Cmenu(options) {
	options = options || {};
	options.className = "Cmenu";
	options.label = "menu";
	this.entries = {};
	Cobject.call(this, options, []);
}

/* Inheritance */
Cmenu.prototype = Object.create(Cobject.prototype);
Cmenu.prototype.constructor = new Cobject();


/**
 *
 */
Cmenu.prototype.init = function(options) {
	for(var label in options.entries) {
		options.entries[label].parent = this;
		this.add(new Cmenu_entry(options.entries[label]));
	}
};
/**
 *
 */
Cmenu.prototype.exists = function(cEntry) {
	if (cEntry.label in this.entries) {
		return true;
	}
	return false;
};
/**
 *
 */
Cmenu.prototype.add = function(cEntry) {
	if (!cEntry || !(cEntry instanceof Cmenu_entry)) {
		this.exception('invalid_menu_entry', cEntry);
	}
	if (this.exists(cEntry)) {
		this.exception('label_already_present', cEntry.label);
	}
	this.entries[cEntry.label] = cEntry;
};

/**
 *
 */
Cmenu.prototype.dom_build = function() {
	var r = $('<ul />');
	for (label in this.entries) {
		var e = this.entries[label].dom_get({noHeader: true});
		r.append(e);
	}
	r.menu();
	this.rootElm = r;
	return this;
};