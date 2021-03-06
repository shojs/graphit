/*******************************************************************************
 * Class representing a colour picker
 * 
 */
function Ctoolbox_colorpicker(color, options) {
	var that = this;
    options.className = 'Ctoolbox_colorpicker';
	options.label = options.label || 'toolbox_colorpicker';
    Cobject.call(this, options, [ 'parent', 'label', 'callback_onchange' ]);
	if (color && !(color instanceof Ccolor)) {
		console.error('color parameter is not an instance of Ccolor');
		return null;
	} else if (color) {
		this.color = color;
	} else {
		this.color = new Ccolor();
	}
	this.color.install_callback({name: 'change', callback: function() {
		that.update();
	}});
	//console.log('label', this.label);
	this.rootElm = null;
	this.cCanvas = new Ccanvas({width: 32, height: 32});
	this.ctx = this.cCanvas.getContext();
	this.clear(this.color);
}

Ctoolbox_colorpicker.prototype = Object.create(Cobject.prototype);
Ctoolbox_colorpicker.prototype.constructor = new Cobject();

/**
 * Fill associated canvas with a given color
 * @param color
 */
Ctoolbox_colorpicker.prototype.clear = function(color) {
	this.cCanvas.clear(color);
};

/**
 * Convert color to string of format << rgba(r,g,ba) >>
 * @returns
 */
Ctoolbox_colorpicker.prototype.to_rgba = function() {
	return this.color.to_rgba();
};

/**
 *
 */
Ctoolbox_colorpicker.prototype.update = function() {
	this.clear(this.color);
	var ctx = this.elmImage.getContext('2d');
	ctx.drawImage(this.cCanvas.data, 0, 0, this.cCanvas.get_width(), this.cCanvas.get_height());
	this.send_trigger('color_selected');	
};
/**
 * Create and store ou html elements
 * @param bool
 * @returns {Ctoolbox_colorpicker}
 */
Ctoolbox_colorpicker.prototype.dom_build = function(bool) {
	var that = this;
	if (this.rootElm) {
		return this;
	}
	var root = document.createElement('div');
	var $r = $(root);
	var img = document.createElement('canvas');
	img.setAttribute('width', 32);
	img.setAttribute('height', 32);
	img.setAttribute('alt', this.label);
	img.setAttribute('title', this.label);
	this.elmImage = img;
	$r.append(img);
	var ctx = img.getContext('2d');
	var c = this.cCanvas.data;
	ctx.drawImage(c, 0, 0, c.width, c.height);
	var update = function(rgb) {
		that.color.set_rgb(rgb);
	};
	$(img).ColorPicker({
		onChange : function(hsb, hex, rgb) {
			update.call(this, rgb);
		},
		onSubmit : function(hsb, hex, rgb) {
			update.call(this, rgb);
		},
		zIndex: 10
	});
	this.rootElm = $r;
	return this;
};