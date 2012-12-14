(function(window, graphit, console, undefined) {

	var modulePath = 'app/toolbox/preview';
	
	var Cobject = graphit.import('lib/object');
	var Ccanvas = graphit.import('lib/canvas');
	/**
	 * @constructor
	 * @param options
	 * @returns
	 */
	function Module(options) {
		var that = this;
		options.className = modulePath;
		options.label = 'toolboxpreview';
		Cobject.call(this, options, [
			'parent'
		]);
		this.bind_trigger(this, 'update', function(e, d) {
			if (window.graphit.debug > 4) console.log('[Trigger/received]',
					e.type);
			// var ctx = that.rootElm.find('canvas')[0].getContext('2d');
			var color = that.parent.fg_color.color.clone().inverse();
			color.a = 1;
			that.cCanvas.clear(color);
			var ctx = that.cCanvas.getContext();
			that.cCanvas.clear();
			var scanvas = that.parent.brush_manager.selected.cCanvas.data;
			var cTool = that.parent.selected;
			var size = cTool.get_parameter('size');
			var width = (size > that.cCanvas.get_width() ? that.cCanvas
					.get_width() : size);
			var height = (size > that.cCanvas.get_height() ? that.cCanvas
					.get_height() : size);
			var offset = (that.cCanvas.get_width() - (size)) / 2;
			ctx.drawImage(scanvas, 0, 0, scanvas.width, scanvas.height, offset,
					offset, width, height);
		});
	}

	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	Module.prototype.init = function() {
		this.cCanvas = new Ccanvas({
			parent : this,
			width : 100,
			height : 100
		});
	};

	Module.prototype.dom_build = function() {
		var r = $('<div />');
		r.addClass('toolbox-preview');
		var g = $('<div />');
		g.append(this.cCanvas.dom_get());
		r.append(g);
		this.rootElm = r;
		return this;
	};

	graphit.export(modulePath, Module);
	
})(window, graphit, console);
