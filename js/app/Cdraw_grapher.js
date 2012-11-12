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

Cdraw_grapher.prototype._graph = function() {
	var numpoint = this.cSurface.mouse.points.length;
	if (numpoint <= 2) {
		return false;
	}
	if (this.index >= (numpoint - 1)) {
		return false;
	}
//	var e = document.getElementById('graphing-area');
//	var radius = this.cTools.size / 2;
//	var color = this.cTools.fg_color.to_rgba();

	var p1 = this.cSurface.mouse.points[this.index];
	var p2 = this.cSurface.mouse.points[(this.index + 1)];
//	var p3 = this.cSurface.mouse.points[this.index + 2];

	
	var tool = this.cTools.selected;
	var dcanvas = this.cSurface.layer_manager.special_layers.prefrag.canvas;
	var ctx = dcanvas.getContext('2d');

	var scanvas = tool.cCanvas.data;
	if (tool.label == 'eraser') {
		//ctx.fillStyle = 'rgba(0,0,0,1)';
		//scanvas.getContext('2d').
		//ctx.globalCompositeOperation = 'desination-atop'; 
	}
	var dw = scanvas.width / 2;
	var dh = scanvas.height / 2;
	var dctx = scanvas.getContext('2d');
	var ptrn = ctx.createPattern(this.cTools.selected.cCanvas.data,'repeat');
	//ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = this.cTools.fg_color.to_rgba();
	ctx.lineWidth = this.cTools.selected.parameters.size.value;
	ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
	//ctx.moveTo(p1.x, p1.y);
	//ctx.lineTo(p2.x, p2.y);
	ctx.stroke();
	//ctx.closePath();
	//ctx.restore();
	//console.log(dcanvas.toDataURL());
//	
//	var points = math_linear_interpolation2(p1, p2, 0.1);//pression);
//	if (!points) {
//		this.index++;
//		return false;
//	}
//	for ( var i = 0; i < points.length; i++) {
//		ctx.save();
//		ctx.translate(points[i].x - dw, points[i].y - dh);
//		ctx.drawImage(scanvas, 0,0, scanvas.width, scanvas.height);
//		ctx.restore();
//	}
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
	var size = this.cTools.selected.parameters.size.value * 2;
	var dsize = Math.round(size / 2);
	var width = Math.round(cs.mouse.maxx - cs.mouse.minx + size);
	var height = Math.round(cs.mouse.maxy - cs.mouse.miny + size);
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
