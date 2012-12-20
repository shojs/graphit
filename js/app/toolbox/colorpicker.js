(function(window, graphit, console, undefined) {

	var modulePath = 'app/toolbox/colorPicker';
	
	var Cobject = graphit.import('lib/object');
	var Ccolor = graphit.import('lib/color');
	var Ccanvas = graphit.import('lib/canvas');

	
	/***************************************************************************
	 * @constructor Class representing a colour picker
	 */
	function Module(color, options) {
		var that = this;
		options = options || {};
		options.className = modulePath;
		options.label = options.label || 'toolbox_colorpicker';
		Cobject.call(this, options, [
				'parent', 'label', 'callback_onchange'
		]);
		if (color && !(color instanceof Ccolor)) {
			console.error('color parameter is not an instance of Ccolor');
			return null;
		} else if (color) {
			this.color = color;
		} else {
			this.color = new Ccolor();
		}
		this.color.install_callback({
			name : 'change',
			callback : function() {
				that.update();
			}
		});
		// console.log('label', this.label);
		this.rootElm = null;
		this.cCanvas = new Ccanvas({
			width : 32,
			height : 32
		});
		this.ctx = this.cCanvas.getContext('2d');
		this.clear(this.color);
	}

	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * Fill associated canvas with a given color
	 * 
	 * @param color
	 */
	Module.prototype.clear = function(color) {
		this.cCanvas.clear(color);
	};

	/**
	 * Convert color to string of format << rgba(r,g,ba) >>
	 * 
	 * @returns
	 */
	Module.prototype.to_rgba = function() {
		return this.color.to_rgba();
	};

	/**
	 *
	 */
	Module.prototype.update = function() {
		this.clear(this.color);
		var ctx = this.elmImage.getContext('2d');
		ctx.drawImage(this.cCanvas.data, 0, 0, this.cCanvas.get_width(),
				this.cCanvas.get_height());
		this.send_trigger('color_selected');
	};
	/**
	 * Create and store ou html elements
	 * 
	 * @param bool
	 * @returns {Module}
	 */
	Module.prototype.dom_build = function(bool) {
		var that = this;
		if (this.rootElm) {
			return this;
		}
		var root = $('<div />');
		var img = document.createElement('canvas');
		img.setAttribute('width', 32);
		img.setAttribute('height', 32);
		img.setAttribute('alt', this.label);
		img.setAttribute('title', this.label);
		this.elmImage = img;
		root.append(img);
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
			zIndex : 10,
		});
		this.rootElm = $(img);
		return this;
	};
	
	graphit.export(modulePath, Module);
	
})(window, graphit, console);
