(function(window, graphit, console, undefined) {
	 
	'use strict';
	
	var modulePath = 'lib/canvas';
	
	var Cobject = graphit.import('lib/object');
	var Ccolor = graphit.import('lib/color');
	
	/**
	 * @constructor A class holding a canvas element
	 * @param options
	 *            {Hash} Cobject parameters hash
	 */
	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.label = 'canvas';
		Cobject.call(this, options, [
				'width', 'height', 'bg_color', 'src'
		]);
		this.bg_color = this.bg_color || new Ccolor();
		if (!this.width || this.width < 0 || this.width > 1920) this.exception(
				'invalid_width', this.width);
		if (!this.height || this.height < 0 || this.height > 1280) this
				.exception('invalid_height', this.height);

		this.data = document.createElement('canvas');
		this.data.setAttribute('width', this.width);
		this.data.setAttribute('height', this.height);
		this.ctx = this.data.getContext('2d');
		this.clear(this.bg_color);
		if (this.src) {
			this.load(this.src);
		}
	}
	;

	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	Module.prototype.clone = function() {
		var c = new Module({
			width : this.width,
			height : this.height,
			bg_color : this.bg_color
		});
		c.copy({
			src : this
		});
		return c;
	};

	Module.prototype.get_width = function() {
		return this.data.width;
	};

	Module.prototype.get_height = function() {
		return this.data.height;
	};

	Module.prototype.getImageData = function(x, y, width, height) {
		var ctx = this.data.getContext('2d');
		return ctx.getImageData(x, y, width, height);
	};

	Module.prototype.copy = function(opt) {
		if (!opt.src
				&& (!(opt.src instanceof Module) || !(opt.src instanceof Cimage))) {
			this.exception('invalid_copy_source');
		}
		var data = null;
		var dw, dh, sw, sh = null;
		dw = this.get_width();
		dh = this.get_height();
		if (opt.src instanceof Module) {
			data = opt.src.data;
			sw = opt.src.get_width();
			sh = opt.src.get_height();
		} else {
			data = opt.src;
			sw = data.width;
			sh = data.height;
			console.log('sw, dw', sw, sh);
		}
		opt.resize = (opt.resize != undefined ? opt.resize : false);
		var ctx = this.data.getContext('2d');
		ctx.save();
		if (opt.resize != 'undefined' && opt.resize) {
			ctx.drawImage(data, 0, 0, sw, sh, 0, 0, dw, dh);
		} else if (opt.keepRatio) {
			/** @TODO: keep ratio is bugged ... */
			var width = this.data.width;
			var ratio = (opt.src.get_width() / opt.src.get_height()) / width;
			var height = this.data.height * ratio;
			ctx.drawImage(opt.src.data, 0, 0, opt.src.get_width(), opt.src
					.get_height(), 0, 0, width, height);
		} else {
			var dwidth = sw > dw ? dw : sw;
			var dheight = sh > dh ? dh : sh;
			var offx = (dw > dwidth) ? (dw - dwidth) / 2 : 0;
			var offy = (dh > dheight) ? (dh - dheight) / 2 : 0;
			offx = offy = 0;

			ctx.drawImage(data, 0, 0, dwidth, dheight, offx, offy, dwidth,
					dheight);
			// console.log('Image', this.data.toDataURL());
		}
		;
		ctx.restore();
	};

	Module.prototype.get_pixel_color = function(data, x, y, Ecolor) {
		return data.data[((x * (data.width * 4)) + (y * 4) + Ecolor)];
	};

	Module.prototype.getCanvas = function() {
		return this.data;
	};

	Module.prototype.getContext = function(type) {
		type = type || '2d';
		if ('data' in this) {
			return this.data.getContext(type);
		}
		console.error('Cannot return context for this object... no cCanvas');
		return null;
	};

	Module.prototype.clear = function(color) {
		color = color || new Ccolor();
		var ctx = this.getContext();
		if (color.a == 0) {
			ctx.clearRect(0, 0, this.data.width, this.data.height);
		} else {
			ctx.save();
			ctx.fillStyle = color.to_rgba();
			ctx.fillRect(0, 0, this.data.width, this.data.height);
			ctx.restore();
		}
	};

	Module.prototype.save = function() {
		var data = this.data.toDataURL('image/png');
		if (!window.open(data)) {
			document.location.href = data;
		}
	};

	var Ergb_color = {
		red : 0,
		green : 1,
		blue : 2,
		alpha : 3
	};

	Module.prototype.load = function(src) {
		var that = this;
		this.image_loading = new Cimage({
			src : src,
			callback_onload : function() {
				console.log('Image loaded', this);
				var w = cMath.clamp(1, this.rootElm.width, that.data.width);
				var h = cMath.clamp(1, this.rootElm.height, that.data.height);
				that.data.getContext('2d').drawImage(this.rootElm, 0, 0, w, h);
				that.image_loading = null;
			},
			callback_onerror : function() {
				console.log('Failed to load image', this);
				that.image_loading = null;
			}
		});
	};

	Module.prototype.dom_build = function() {
		this.rootElm = this.data;
		return this;
	};

	graphit.export(modulePath, Module);

})(window, graphit, console);
