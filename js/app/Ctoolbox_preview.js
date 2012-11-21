function Ctoolbox_preview(options) {
    var that = this;
    options.className = 'Ctoolbox_preview';
    options.label = 'toolboxpreview';
    Cobject.call(this, options, ['parent']);
    this.bind_trigger(this.parent, 'update', function(e,d) {
	if (SHOJS_DEBUG > 4) console.log('[Trigger/received]', e.type);
	var ctx = that.rootElm.find('canvas')[0].getContext('2d');
	var color = that.parent.fg_color.color.clone().inverse();
	//color.a = 1;
	that.cCanvas.clear(color);
	that.cCanvas.copy(that.parent.selected.cCanvas);
	
    });
}

Ctoolbox_preview.prototype = Object.create(Cobject.prototype);
Ctoolbox_preview.prototype.constructor = new Cobject();

Ctoolbox_preview.prototype.init = function() {
    this.cCanvas = new Ccanvas({parent: this, width: 100, height: 100, src: 'img/loading_toolbar_brush.png'});
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
