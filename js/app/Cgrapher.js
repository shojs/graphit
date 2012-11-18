var Egrapher_mode = {
	continuous: 1,
	endpoint: 2,
};
/**
 * 

 * @param cTools
 * @param cSurface
 * @returns
 */

function Cgrapher(cTools, cSurface) {
	this.set(cTools, cSurface);
	this.reset_index();
	this.timer = null;
	cSurface.cGrapher = this;
	this.mode = Egrapher_mode.continuous;
}

Cgrapher.prototype.set = function(cTools, cSurface) {
	this.cTools = cTools;
	this.cSurface = cSurface;
};

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
	//console.log(p1, p2);
	if (this.cTools.selected.graph(this, p1, p2)) {
	    this.cSurface.redraw(true);
	}
	this.index++;
	this._graph();
	return true;
};

Cgrapher.prototype.stop = function() {
    	// TODO Clean fragment size...
	if (!this.timer) {
		console.warn('Grapher is not started');
		return false;
	}
	clearInterval(this.timer);
//	var lmouse = this.cSurface.layer_manager.special_layers.mouse;
//	lmouse.ctx.fillStyle = 'rgba(255,0,0,0.1)';
	var cs = this.cSurface;
	var selected = cs.layer_manager.selected;
	var dcanvas = selected.cCanvas.data;
	var size = (this.cTools.selected.parameters.size.value);
	var dsize = size / 2;
	var width = (cs.cMouse.maxx - cs.cMouse.minx) + size;
	var height = (cs.cMouse.maxy - cs.cMouse.miny) + size;
	var x = cs.cMouse.minx - dsize;
	if (x < 0) { x = 0;} 
	if ((x + width) > dcanvas.width) { width = dcanvas.width - x;}
	var y = cs.cMouse.miny - dsize;
	if (y < 0) { y = 0;}
	if ((y + height) > dcanvas.height) { height = dcanvas.height - y;}
	if ('_postgraph' in this.cTools.selected) {
	    this.cTools.selected._postgraph(x, y, 
		    width, height, 0, 0, width, height);
	} else {
	    cs.layer_manager.selected.drawImage(
			cs.layer_manager.special_layers.prefrag.cCanvas.data, 
			x, y, width,
			height, 0, 0);
	}
	cs.layer_manager.selected.redraw();
	cs.layer_manager.special_layers.prefrag = 
	    new Clayer(cs.layer_manager, '_prefrag');
	this.timer = null;
	this.index = 0;
	cs.redraw(true);
	return true;
};

Cgrapher.prototype.start = function() {
	if (this.timer) {
		console.error('Grapher already started');
		return false;
	}
	var that = this;
	var fGraph = function() {
		that._graph();
	};
	if (!this.cTools) { return false; };
	if ('_pregraph' in this.cTools.selected) {
	    this.cTools.selected._pregraph(this);
	}
	this.timer = window.setInterval(fGraph, DRAWGLOB.graphing_interval);
	return true;
};
