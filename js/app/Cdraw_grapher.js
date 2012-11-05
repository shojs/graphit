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

Cdraw_grapher.prototype._graph = function() {
	//console.log('Graphing');
	var numpoint = cSurface.mouse.points.length;
	if (numpoint < 2) {
		console.log('need two points');
		return false;
	}
	if (this.index >= numpoint) {
		console.log('nothing to graph');
		return false;
	}
	var e = document.getElementById('graphing-area');
	//var ctx = e.getContext('2d');

	var p = cSurface.mouse.points[this.index];
	var p0 = cSurface.mouse.points[(this.index + 1)];
	//console.log('Distance: ' + geom_distance(p0, p));
	var radius = this.cTools.size / 2;
	helper_draw_circle(e, p.x, p.y, radius, this.cTools.color.to_rgba());
	this.index++;
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
	this.timer = window.setInterval(fGraph, 5);
	return true;
};

