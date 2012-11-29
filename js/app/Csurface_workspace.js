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
	navbar.append(new Cimage({
		src: 'img/stock-image-24.png',
		width: 32,
		height: 32,
		label: T('save'),
		callback_click: function() {
			//that.cSurface.layer_manager.dom_get().dialog({autoOpen:true});
			that.save_dialog();
			return false;
		},
	}).dom_get());
	r.append(navbar);
	r.append(this.cSurface.dom_get());						
	this.rootElm = r;
	return this;
};			

/**
 * Method
 */
Csurface_workspace.prototype.save_dialog = function() {
	var r = $('<div />');
	r.attr('title', 'save');
	var canvas = this.cSurface.cCanvas.clone();
	var w = window.open(null, 'graphit-save', 'resizable=yes, scrollbars=yes, titlebar=yes, width=300, height=300 top=10, left=10', false);
	var head = $(w.document.head);
	if (head.find('title').length == 0) {
		head.append('<title>GraphIt - '+ T('save_image') + '</title>');
	}
	var css = $('<link id="id-graphit-css" type="text/css" rel="stylesheet" href="css/style.css"/>');
	if (head.find('#id-graphit-css').length == 0) {
		head.append(css);
	}
	var body = $(w.document.body);
	body.empty();
	var g = $('<div class="graphit-window group" />');
	g.append('<h3>'+T('right_click_to_save')+'<h3/>');
	var img = new $('<img />');
	img.attr('src', canvas.data.toDataURL());
	img.attr('width', 200);
	img.attr('title', "graphit-image");
	img.attr('alt', "graphit-image");
	img.css('background-image', 'url("img/grid-40x40.png")');
	g.append(img);
	body.append(g);
};

/**
 *
 */
Csurface_workspace.prototype.show = function() {
	this.dom_get();//.parent();//.dialog('open');
};