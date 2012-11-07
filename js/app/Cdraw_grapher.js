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

function Cpoint (x, y) {
	this.x = x;
	this.y = y;
}

function math_linear_interpolation(p1, p2, step) {
	step = 0.5;
	var points = new Array();
	var x1 = p1.x;
	var x2 = p2.x;
	if (p1.x >= p2.x) { x1 = p2.x; x2 = p1.x; }
	var slope = (p2.y - p1.y) / (p2.x - p1.x);
	for (var x = x1; x <= x2; x += step) {
		var y = Math.round(slope * (x - p1.x) + p1.y);
		points.push(new Cpoint(x, y));
	}
	return points;
};

Cdraw_grapher.prototype._graph = function() {
	var numpoint = cSurface.mouse.points.length;
	if (numpoint <= 2 ) {
		//console.log('need two points');
		return false;
	}
	if (this.index >= (numpoint - 1)) {
		//console.log('nothing to graph');
		return false;
	}
	var e = document.getElementById('graphing-area');
	var radius = this.cTools.size / 2;
	var color = this.cTools.color.to_rgba();
	
	var p1 = this.cSurface.mouse.points[this.index];
	var p2 = this.cSurface.mouse.points[(this.index + 1)];
		var points = math_linear_interpolation(p1, p2, radius);
		for (var i = 0; i < points.length; i++) {
			helper_draw_circle(e, points[i].x, points[i].y, radius, color);
		}
	this.index++;
	this._graph();
	return true;
};

Cdraw_grapher.prototype.stop = function() {
	if (!this.timer) {
		console.error('Grapher is not started');
		return false;
	}
	clearInterval(this.timer);
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

