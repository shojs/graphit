function Cmetasurface(options) {
    Cobject.call(this, options, []);
    this.cSurface = null;
    this.rootElm = null;
    this.dom_get();
}

Cmetasurface.prototype = Object.create(Cobject.prototype);
Cmetasurface.prototype.constructor = new Cobject();

Cmetasurface.prototype.attach_surface = function(pSurface) {
    if (this.pSurface) {
	console.error('There is already a surface attached');
	return null;
    }
    this.cSurface = pSurface;
    var r = this.rootElm.find('.metasurface-container');
    //r.empty();
    r.append(this.cSurface.dom_get());
    return this;
};

Cmetasurface.prototype.dom_build = function() {
    var r = $('<div title="Meta surface"/>');
    var g = $('<div />');
    g.addClass('metasurface-container');
    r.append(g);
    r.dialog({});
    this.rootElm = r;
    return this;
};



