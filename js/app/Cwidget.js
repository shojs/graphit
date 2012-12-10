function Cwidget(parent, label) {
	//if (!label) { console.warn('Creating Cwidget without label'); }
	Cobject.call(this);
	this.label = label;
	this.parent = parent;
	this.dom = null;
};


Cwidget.prototype = Object.create(Cobject.prototype);
Cwidget.prototype.constructor = new Cobject();

Cwidget.prototypeedom_get = function(force) {
	if (this.dom && !force) {
		return this.dom;
	}
	return this.dom_build().dom;
};
/******************************************************************************
 * 
 * @param parent
 * @param label
 * @returns
 */
function Cwidget_window_header(parent, label) {
	Cwidget.call(this, parent, label);
}

Cwidget_window_header.prototype = Object.create(Cwidget.prototype);
Cwidget_window_header.prototype.constructor = new Cwidget();

Cwidget_window_header.prototype.dom_build = function() {
	var $r = $(document.createElement('div'));
	$r.addClass('window-header');
	$r.append(this.label);
	this.dom = $r;
	return this;
};


/******************************************************************************
 * 
 * @param parent
 * @param label
 * @returns
 */
function Cwidget_window(parent, label) {
	Cwidget.call(this, parent, label);
	this.wHeader = new Cwidget_window_header(this, label);
}

Cwidget_window.prototype = Object.create(Cwidget.prototype);
Cwidget_window.prototype.constructor = new Cwidget();

Cwidget_window.prototype.dom_build = function() {
	var $r = $(document.createElement('div'));
	$r.addClass('widget-window');
	$r.append(this.wHeader.dom_get());
	this.dom = $r;
	return this;
};


var WM = new Cwidget_window();
