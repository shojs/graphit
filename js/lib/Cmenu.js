/**
 * Class  Cmenu
 * 06:40:06 / 24 nov. 2012 [jsgraph] sho 
 */
function Cmenu(options) {
	options = options || {};
	options.className = "Cmenu";
	options.label = options.label || "menu";
	options.type = options.type || 'jquery';
	this.entries = {};
	Cobject.call(this, options, ['type', 'parent']);
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
		options.entries[label].type = this.type;
		this.add(new Cmenu(options.entries[label]));
	}
};
/**
 *
 */
Cmenu.prototype.exists = function(cMenu) {
	if (cMenu.label in this.entries) {
		return true;
	}
	return false;
};
/**
 *
 */
Cmenu.prototype.add = function(cMenu) {
	if (!cMenu || !(cMenu instanceof Cmenu)) {
		this.exception('invalid_menu_entry', cMenu);
	}
	if (this.exists(cMenu)) {
		this.exception('label_already_present', cMenu.label);
	}
	this.entries[cMenu.label] = cMenu;
};

/**
 * #TODO This dom_build is the ugliest one, well one of the less pretty ...
 */
Cmenu.prototype.dom_build = function() {
	var that = this;
	var r;
	if (parent in this && this.parent instanceof Cmenu) {
		r = this.parent.rootElm;
		r.find('ul').removeClass('cssMenu');
	} else {
		r = $('<ul />');
		if (this.type == 'css') {
			r.addClass("cssMenum cssMenu");
		}
	}
	for (var label in this.entries) {
		var cEntry = this.entries[label];
		var a = $('<a href="#" title=""/>');
		if (cEntry.type == 'css') {
			a.addClass('cssMenui');
		}
		a.attr('label', label);
		if ('click' in cEntry.callback) {
			cEntry.install_callback(a); 
		}
		var c = $('<li />');
		if (this.type == 'css') {
			if (cEntry.type == 'css') c.addClass('cssMenui');
		}
			a.append('<span>' + label + '</span>');
			c.append(a);
			var e = cEntry.dom_get({noHeader: true});
			c.append(e);
		r.append(c);
	}
	if (this.type == 'jquery' && (!this.parent || !(this.parent instanceof Cmenu))) {
		r.menu();
		r.menu('enable');
	}
	if (!this.parent || !(this.parent instanceof Cmenu)) {
		var f = $('<div />');
		f.append(r);
		r = f;
	}

	this.rootElm = r;
	return this;
};

/**
 *
 */
Cmenu.prototype.install_callback = function(elm) {
	var that = this;
	elm.click(function() {
		that.callback.click();
	});
};

/**
 *
 */
Cmenu.prototype.count_childs = function() {
	var i = 0;
	for (c in this.entries) {
//		if (this.entries.hasOwnProperty(c)) 
//		{ continue;}
		i++;
	}
	return i;
};