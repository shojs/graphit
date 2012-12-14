(function(window, graphit, console, undefined) {

	var Cobject = graphit.import('lib/object');
/**
 * @constructor
 * @param parent
 * @param label
 * @returns
 */function Cwidget(parent, label) {
	//if (!label) { console.warn('Creating Cwidget without label'); }
	Cobject.call(this);
	this.label = label;
	this.parent = parent;
	this.dom = null;
};


Cwidget.prototype = Object.create(Cobject.prototype);
Cwidget.prototype.constructor = new Cobject();

Cwidget.prototype.dom_get = function(force) {
	if (this.dom && !force) {
		return this.dom;
	}
	return this.dom_build().dom;
};
/******************************************************************************
 * @constructor
 * @param parent
 * @param label
 * @returns
 */
function Module_header(parent, label) {
	Cwidget.call(this, parent, label);
}

Module_header.prototype = Object.create(Cwidget.prototype);
Module_header.prototype.constructor = new Cwidget();

Module_header.prototype.dom_build = function() {
	var $r = $(document.createElement('div'));
	$r.addClass('window-header');
	$r.append(this.label);
	this.dom = $r;
	return this;
};


/******************************************************************************
 * @constructor
 * @param parent
 * @param label
 * @returns
 */
function Module(parent, label) {
	Cwidget.call(this, parent, label);
	this.wHeader = new Module_header(this, label);
}

Module.prototype = Object.create(Cwidget.prototype);
Module.prototype.constructor = new Cwidget();

Module.prototype.dom_build = function() {
	var $r = $(document.createElement('div'));
	$r.addClass('widget-window');
	$r.append(this.wHeader.dom_get());
	this.dom = $r;
	return this;
};


graphit.export('app/widget', Module);

})(window, graphit, console);
