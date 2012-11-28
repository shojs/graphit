/**
 * Class  Csurface_workspace
 * 12:12:16 / 25 nov. 2012 [jsgraph] sho 
 */
function Csurface_workspace(options) {
	options = options || {};
	options.className = "Csurface_workspace";
	options.label = "Csurface_workspace";
	Cobject.call(this, options, []);
}

/* Inheritance */
Csurface_workspace.prototype = Object.create(Cobject.prototype);
Csurface_workspace.prototype.constructor = new Cobject();

/**
 * Class init
 */
Csurface_workspace.prototype.init = function(opt) {
	var that = this;
	try {
		this.cSurface = new Csurface(opt);
	} catch (e) {
		console.error('Cannot create surface');
		throw e;
	}
	this.bind_trigger(this, 'show', function() { that.show(); });
};

/**
 * DOM element
 */
Csurface_workspace.prototype.dom_build = function() {
	var that = this;
	var r = $('<div class="graphit-workspace"/>');
	var navbar = $('<div class="navbar"/>');
	navbar.append(new Cimage({
		src: 'img/stock-layers-24.png',
		width: 32,
		height: 32,
		label: T('layers'),
		callback_click: function() {
			that.cSurface.layer_manager.dom_get().dialog({autoOpen:true});
			return false;
		},
	}).dom_get());
	r.append(navbar);
	r.append(this.cSurface.dom_get());						
	this.rootElm = r;
	return this;
};			

/**
 *
 */
Csurface_workspace.prototype.show = function() {
	this.dom_get();//.parent();//.dialog('open');
};