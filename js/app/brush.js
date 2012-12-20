(function(window, graphit, console, undefined) {

	'use strict';
	
	var modulePath = 'app/brush';
	
	/**
	 * Imports
	 */
	var Cobject = graphit.import('lib/object');
	var Etype = graphit.import('app/brush/enum/type');
	var Ccanvas = graphit.import('lib/canvas');
	var Ccolor = graphit.import('lib/color');
	
	/**
	 * @constructor
	 */
	function Module(options) {
		options.className = modulePath;
		options.label = "brush";
		Cobject.call(this, options, [
				'parent', 'name', 'type'
		]);
	}

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 *
	 */
	Module.prototype.init = function(options) {
		if (!this.type || !this.name) {
			console.error("Module need <<type>> and <<name>> parameter");
			return false;
		}
		if (this.type == Etype.js) {
			this._load_js(options);
		} else if (this.type == Etype.gbr) {
			console.log('Parsing Gimp Brush');
			this._load_gbr(options);
		} else {
			thix.exception('unknown_brush_type', this.type);
			return false;
		}
		return this.init_canvas(options);
	};

	/**
	 *
	 */
	Module.prototype.init_canvas = function(options) {
		var canvas = new Ccanvas({
			width : options.data.width,
			height : options.data.height
		});
		canvas.clear(new Ccolor());
		this.cCanvas = canvas;
		// this.callback.update.call(this, this.parent);
	};

	/**
	 *
	 */
	Module.prototype.update = function() {
		this.callback.update.call(this, this.parent);
	};

	/**
	 *
	 */
	Module.prototype._load_js = function(options) {
		if (!('callback_update' in options.data)) {
			console
					.error('Javascript brush must contain a callback_update function');
			return false;
		}
		this.callback.update = options.data.callback_update;
		if (!('width' in options.data) || !('height' in options.data)) {
			console.error('Javascript brush need width and height property');
			return false;
		}
		return true;
	};

	/**
	 *
	 */
	Module.prototype._load_gbr = function(dumbopt) {
		// dumb comment
	};

	/**
	 *
	 */
	Module.prototype.dom_build = function() {
		var that = this;
		var r = $('<div />');
		var g = $('<div />');
		g.addClass('group-brush group');
		g.append('<label>' + Etype.key_by_value(this.type) + ' / '
				+ this.name + '</label>');
		console.log('Ccanvas', this.cCanvas);
		g.append(this.cCanvas.dom_get());
		r.append(g);
		r.click(function() {
			that.send_trigger('brush_selected', that);
			var g = $(this).parents('.group-brushmanager').find('.group-brush')
					.removeClass('selected');
			$(this).children('.group-brush').addClass('selected');
		});
		this.rootElm = r;
		return this;
	};
	graphit.export(modulePath, Module);
	
})(window, graphit, console);
