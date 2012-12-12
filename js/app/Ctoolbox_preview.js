/**
 * @constructor
 * @param options
 * @returns
 */
function Ctoolbox_preview(options) {
	var that = this;
	options.className = 'Ctoolbox_preview';
	options.label = 'toolboxpreview';
	Cobject.call(this, options, [
		'parent'
	]);
	this.bind_trigger(this, 'update', function(e, d) {
		if (window.graphit.debug > 4) console.log('[Trigger/received]', e.type);
		//var ctx = that.rootElm.find('canvas')[0].getContext('2d');
		var color = that.parent.fg_color.color.clone().inverse();
		color.a = 1;
		that.cCanvas.clear(color);
		var ctx = that.cCanvas.getContext();
		that.cCanvas.clear();
		var scanvas = that.parent.brush_manager.selected.cCanvas.data;
		var cTool = that.parent.selected;
		var size = cTool.get_parameter('size');
		var width = (size > that.cCanvas.get_width()? that.cCanvas.get_width(): size);
		var height = (size > that.cCanvas.get_height()? that.cCanvas.get_height(): size);
		var offset = (that.cCanvas.get_width() - (size)) / 2;
		ctx.drawImage(scanvas, 0, 0, scanvas.width, scanvas.height, offset,offset, width, height);
	});
}

Ctoolbox_preview.prototype = Object.create(Cobject.prototype);
Ctoolbox_preview.prototype.constructor = new Cobject();

Ctoolbox_preview.prototype.init = function() {
    this.cCanvas = new Ccanvas({parent: this, width: 100, height: 100});
};

Ctoolbox_preview.prototype.dom_build = function() {
     var r = $('<div />');
     r.addClass('toolbox-preview');
     var g = $('<div />');
     g.append(this.cCanvas.dom_get());
     r.append(g);
     this.rootElm = r;
     return this;
};
