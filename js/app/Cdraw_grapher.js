/**
 * 
 * @param cTools
 * @param cSurface
 * @returns
 */

function Cdraw_grapher(cTools, cSurface) {
	this.set(cTools, cSurface);
	this.reset_index();
	this.timer = null;
	cSurface.cGrapher = this;
}

Cdraw_grapher.prototype.set = function(cTools, cSurface) {
	this.cTools = cTools;
	this.cSurface = cSurface;
};

Cdraw_grapher.prototype.reset_index = function() {
	this.index = 0;
};

function math_linear_interpolation(p1, p2, step) {
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

Cdraw_grapher.prototype._graph = function() {
	var numpoint = cSurface.mouse.points.length;
	if (numpoint <= 2) {
		// console.log('need two points');
		return false;
	}
	if (this.index >= (numpoint - 1)) {
		// console.log('nothing to graph');
		return false;
	}
	var e = document.getElementById('graphing-area');
	var radius = this.cTools.size / 2;
	var color = this.cTools.color.to_rgba();

	var p1 = this.cSurface.mouse.points[this.index];
	var p2 = this.cSurface.mouse.points[(this.index + 1)];
	var pression = (100 - this.cTools.pression) * radius;
	if (pression <= 0) {
		pression = 1.01;
	}

	pression = Math.log(pression + (radius / 100));

	// console.log('pression: ' + pression);
	var points = math_linear_interpolation(p1, p2, pression);
	for ( var i = 0; i < points.length; i++) {
		helper_draw_circle(
				this.cSurface.layer_manager.special_layers.prefrag.canvas,
				points[i].x, points[i].y, radius, color);
	}
	this.index++;
	this.cSurface.redraw();
	this._graph();
	return true;
};

Cdraw_grapher.prototype.stop = function() {
	if (!this.timer) {
		console.warn('Grapher is not started');
		return false;
	}
	clearInterval(this.timer);
	var lmouse = this.cSurface.layer_manager.special_layers.mouse;
	lmouse.ctx.fillStyle = 'rgba(255,0,0,0.1)';
	var cs = this.cSurface;
	var dsize = Math.round(this.cTools.size / 2);
	var width = Math.round(cs.mouse.maxx - cs.mouse.minx + this.cTools.size);
	var height = Math.round(cs.mouse.maxy - cs.mouse.miny + this.cTools.size);
	var x = Math.round(cs.mouse.minx - dsize);
	var y = Math.round(cs.mouse.miny - dsize);

	cs.layer_manager.current_layer.drawImage(
			cs.layer_manager.special_layers.prefrag.canvas, x, y, width,
			height, 0, 0, width, height);
	cs.layer_manager.special_layers.prefrag.clear();
	this.timer = null;
	this.index = 0;
	return true;
};

Cdraw_grapher.prototype.start = function() {
	if (this.timer) {
		console.error('Grapher already started');
		return false;
	}
	var that = this;
	var fGraph = function() {
		that._graph();
	};
	this.timer = window.setInterval(fGraph, DRAWGLOB.graphing_interval);
	return true;
};
