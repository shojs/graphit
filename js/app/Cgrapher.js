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

function Cgrapher(options) {
	options = options || {};
	options.className = 'Cgrapher';
	options.label = 'grapher';
    	Cobject.call(this, options, ['parent']);

}

Cgrapher.prototype = Object.create(Cobject.prototype);
Cgrapher.prototype.constructor = new Cobject();

/**
 *
 */
Cgrapher.prototype.init = function() {
	if (!this.parent) this.exception('no_parent_argument');
	this.reset_index();
	this.timer = null;
	this.mode = Egrapher_mode.continuous;
};

Cgrapher.prototype.reset_index = function() {
	this.index = 0;
};

Cgrapher.prototype._graph = function() {
	var cSurface = this.parent.selected;
	var cMouse = cSurface.cMouse;
	var cTool = this.parent.cToolbox.selected;
	var numpoint = cMouse.points.length;
	if (numpoint <= 2) {
		return false;
	}
	if (this.index >= (numpoint - 1)) {
		return false;
	}
	var p1 = cMouse.points[this.index];
	var p2 = cMouse.points[(this.index + 1)];
	if (cTool.graph(this, p1, p2)) {
		if (!this.last_redraw || ((Date.now() - this.last_redraw) > (1000 /60)) ) {
			this.last_redraw = Date.now();
			cSurface.redraw(1);
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
	var cs = this.parent.selected;
	var cMouse = cs.cMouse;
	var cLayer = cs.layer_manager.selected;
	var cPrefrag = cs.layer_manager.special_layers.prefrag;
	var dcanvas = cLayer.cCanvas.data;
	var cTool = this.parent.cToolbox.selected;
	var size = (this.parent.cToolbox.selected.parameters.size.value);
	var dsize = size / 2;
	var width = (cMouse.maxx - cMouse.minx) + size;
	var height = (cMouse.maxy - cMouse.miny) + size;
	var x = cMouse.minx - dsize;
	if (x < 0) { x = 0;} 
	if ((x + width) > dcanvas.width) { width = dcanvas.width - x;}
	var y = cMouse.miny - dsize;
	if (y < 0) { y = 0;}
	if ((y + height) > dcanvas.height) { height = dcanvas.height - y;}
	if ('_postgraph' in cTool) {
	    cTool._postgraph(x, y, 
		    width, height, 0, 0, width, height);
	} else {
	    cLayer.drawImage(
			cPrefrag.cCanvas.data, 
			x, y, width,
			height, 0, 0);
	}
	cLayer.redraw();
	cs.redraw();
	// We are clearing our prefrag layer so it's ready for next draw
	cs.layer_manager.special_layers.prefrag = 
	    new Clayer({ parent: cs.layer_manager, label: '_prefrag', 
	    	width: cs.get_width(), 
	    	height: cs.get_height()});
	
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
	if (!this.parent.cToolbox || !this.parent.cToolbox.selected) { 
	    this.send_trigger('error', 'no-tool-selectionned');
	    console.error('No tool selectionned!');
	    return false; 
	};
	that.timer = window.setInterval(function() {that._graph(); }, 5);
	return true;
};
