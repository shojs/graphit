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
}

Cgrapher.prototype.set = function(cTools, cSurface) {
	this.cTools = cTools;
	this.cSurface = cSurface;
};

Cgrapher.prototype.reset_index = function() {
	this.index = 0;
};

function math_linear_interpolation(p1, p2, step) {
	//step = 0.25;
	if (p1.x == p2.x && p1.y == p2.y) {
		console.warn('interp between same poing ...');
		return null;
	}
	var points = new Array();
	var x1 = p1.x;
	var x2 = p2.x;
	var y1 = p1.y;
	var y2 = p2.y;
	if (p1.x >= p2.x) {
		x1 = p2.x;
		//y1 = p2.y;
		x2 = p1.x;
		//y2 = p1.y;
	}
	var interval = x2 - x1;
	var slope;
	if (x2 == x1) {
		slope = 0;
	} else {
		slope = (y2 - y1) / (interval);
		if (near_zero(slope)) {
			;
		}
	}

	for ( var x = x1; x <= x2 + step; x += step) {
		var y = y1;
		if (interval != 0) {
			var ni = x - x1;
			if (ni != 0) {
				y += (((ni*y2) - (ni*y1) ) / (interval));
			}
		} 
		y = Math.round(y);
		points.push(new Cpoint(x, y));
	}
	return points;
};

function math_linear_interpolation2(p1, p2, step) {
	var points = new Array();
	var x1 = p1.x;
	var x2 = p2.x;
	if (p1.x >= p2.x) {
		x1 = p2.x;
		x2 = p1.x;
	}
	var slope;
	if (p2.x == p1.x) {
		slope = 0;
	} else {
		slope = (p2.y - p1.y) / (p2.x - p1.x);
		if (near_zero(slope)) {
			;
		}
	}
	for ( var x = x1; x <= x2; x += step) {
		var y = Math.round(slope * (x - p1.x) + p1.y);
		points.push(new Cpoint(x, y));
	}
	return points;
};


Cgrapher.prototype._graph = function() {
	var numpoint = this.cSurface.mouse.points.length;
	if (numpoint <= 2) {
		return false;
	}
	if (this.index >= (numpoint - 1)) {
		return false;
	}

	var p1 = this.cSurface.mouse.points[this.index];
	var p2 = this.cSurface.mouse.points[(this.index + 1)];
	
	this.cTools.selected.graph(this, p1, p2);
	this.index++;
	this.cSurface.redraw(true);
	this._graph();
	return true;
};

Cgrapher.prototype.stop = function() {
	if (!this.timer) {
		console.warn('Grapher is not started');
		return false;
	}
	clearInterval(this.timer);
	var lmouse = this.cSurface.layer_manager.special_layers.mouse;
	lmouse.ctx.fillStyle = 'rgba(255,0,0,0.1)';
	var cs = this.cSurface;
	var dcanvas = cs.layer_manager.selected.canvas;
	var size = this.cTools.selected.parameters.size.value * 2;
	var dsize = Math.round(size / 2);
	var width = Math.round(cs.mouse.maxx - cs.mouse.minx + size);
	var height = Math.round(cs.mouse.maxy - cs.mouse.miny + size);
	var x = Math.round(cs.mouse.minx - dsize);
	if (x < 0) { x = 0;} 
	if ((x + width) > dcanvas.width) { width = dcanvas.width - x ;}
	var y = Math.round(cs.mouse.miny - dsize);
	if (y < 0) { y = 0;}
	if ((y + height) > dcanvas.height) { height = dcanvas.height - y ;}
	//console.log(cs);
	if ('_postgraph' in this.cTools.selected) {
	    this.cTools.selected._postgraph(x, y, width, height, 0, 0, width, height);
	} else {
	    cs.layer_manager.selected.drawImage(
			cs.layer_manager.special_layers.prefrag.canvas, x, y, width,
			height, 0, 0, null);
	}
	cs.layer_manager.selected.redraw();
	cs.layer_manager.special_layers.prefrag = new Clayer(cs.layer_manager, '_prefrag');//;.clear(new Ccolor(0,0,0,0));
	
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
	if ('_pregraph' in this.cTools.selected) {
	    this.cTools.selected._pregraph(this);
	}
	this.timer = window.setInterval(fGraph, DRAWGLOB.graphing_interval);
	return true;
};
