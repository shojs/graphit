var Egrapher_mode = {
	continuous: 1,
	endpoint: 2
};
/**
 * 

 * @param cTools
 * @param cSurface
 * @returns
 */

function Cgrapher(cToolbox, cSurface) {
    	Cobject.call(this, {
    	    className: 'Cgrapher',
    	    label: 'grapher',
    	    cToolbox: cToolbox,
    	    cSurface: cSurface
    	}, ['label', 'cToolbox', 'cSurface']);
	this.reset_index();
	this.timer = null;
	this.mode = Egrapher_mode.continuous;
}

Cgrapher.prototype = Object.create(Cobject.prototype);
Cgrapher.prototype.constructor = new Cobject();

Cgrapher.prototype.reset_index = function() {
	this.index = 0;
};

Cgrapher.prototype._graph = function() {
	var numpoint = this.cSurface.cMouse.points.length;
	if (numpoint <= 2) {
		return false;
	}
	if (this.index >= (numpoint - 1)) {
		return false;
	}
	var p1 = this.cSurface.cMouse.points[this.index];
	var p2 = this.cSurface.cMouse.points[(this.index + 1)];
	if (this.cToolbox.selected.graph(this, p1, p2)) {
		if (!this.last_redraw || ((Date.now() - this.last_redraw) > (1000 /60)) ) {
			this.last_redraw = Date.now();
			this.cSurface.redraw(1);
		}
	}
	this.index++;
};

Cgrapher.prototype.stop = function() {

	if (!this.timer) {
		console.warn('Grapher is not started');
		return false;
	}
	// Clearing our timer
	clearInterval(this.timer);
	clearInterval(this.timer_update);
	this.timer = null;
	this.timer_update = null;
	
	// We are drawing our prefrag layer into our current layer
	var cs = this.cSurface;
	var selected = cs.layer_manager.selected;
	var dcanvas = selected.cCanvas.data;
	var size = (this.cToolbox.selected.parameters.size.value);
	var dsize = size / 2;
	var width = (cs.cMouse.maxx - cs.cMouse.minx) + size;
	var height = (cs.cMouse.maxy - cs.cMouse.miny) + size;
	var x = cs.cMouse.minx - dsize;
	if (x < 0) { x = 0;} 
	if ((x + width) > dcanvas.width) { width = dcanvas.width - x;}
	var y = cs.cMouse.miny - dsize;
	if (y < 0) { y = 0;}
	if ((y + height) > dcanvas.height) { height = dcanvas.height - y;}
	if ('_postgraph' in this.cToolbox.selected) {
	    this.cToolbox.selected._postgraph(x, y, 
		    width, height, 0, 0, width, height);
	} else {
	    cs.layer_manager.selected.drawImage(
			cs.layer_manager.special_layers.prefrag.cCanvas.data, 
			x, y, width,
			height, 0, 0);
	}
	cs.layer_manager.selected.redraw();
	// We are clearing our prefrag layer so it's ready for next draw
	cs.layer_manager.special_layers.prefrag = 
	    new Clayer(cs.layer_manager, '_prefrag');
	
	// Reseting index that represent where we are into recorded points
	this.index = 0;
	return true;
};

Cgrapher.prototype.start = function() {
	if (this.timer) {
		console.error('Grapher already started');
		return false;
	}
	var that = this;
	if (!this.cToolbox || !this.cToolbox.selected) { 
	    this.send_trigger('error', 'no-tool-selectionned');
	    console.error('No tool selectionned!');
	    return false; 
	};
	that.timer = window.setInterval(function() {that._graph(); }, 5);
	return true;
};
