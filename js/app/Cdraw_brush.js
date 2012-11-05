/**
 * 
 */
var E_BRUSHSHAPE = new Object({
	circle : 1,
});

function get_drawing_brush_general(oBrush) {
	var canvas = document.createElement('canvas');
	canvas.setAttribute('width', oBrush.size);
	canvas.setAttribute('height', oBrush.size);
	return canvas;
}

function get_drawing_brush_circle(oBrush) {
	var canvas = get_drawing_brush_general(oBrush);
	var x = Math.floor(oBrush.width / 2);
	var y = Math.floor(oBrush.height / 2);
	var r = Math.floor(oBrush.size / 2);
	helper_draw_circle(canvas, r, r, r, oBrush.color.to_rgba());
	return canvas;
}

function helper_alphaper2hex(alpha) {
	var v = Math.floor(alpha * (1 * (255 / 100)));
	return v;
}

function Cdraw_brush() {
	this.width = 100;
	this.height = 100;
	this.color = new Ccolor(255, 0, 0, 0);
	this.set_size(20);
	this.set_opacity(100);
	this.set_rotation(0);
	this.need_redraw = true;
	this.canvas = null;
	this.ctx = null;
	this.shape = E_BRUSHSHAPE.circle;
	this.build_canvas();
}

Cdraw_brush.prototype.set_color = function(color) {
	this.color.r = color.r;
	this.color.g = color.g;
	this.color.b = color.b;
	this.need_redraw = true;
};

Cdraw_brush.prototype.set_rotation = function(rotation) {
	this.rotation = rotation;
	this.need_redraw = true;
};

Cdraw_brush.prototype.set_opacity = function(opacity) {
	this.opacity = opacity;
	this.color.a = helper_alphaper2hex(this.opacity);
	this.need_redraw = true;
};

Cdraw_brush.prototype.set_size = function(size) {
	this.size = size;
	this.need_redraw = true;
};

Cdraw_brush.prototype.redraw = function(canvas) {
	if (this.build_canvas()) {
		this.drawing(canvas, 0, 0);
	}
};

Cdraw_brush.prototype.drawing = function(tcanvas, tx, ty) {
	var ctx = tcanvas.getContext('2d');
	//ctx.fillStyle = 'rgba(0,0,0,0)';
	//ctx.fillRect(0, 0, this.width, this.height);
	var du = this.canvas.toDataURL();
	console.log(du);
	$('.draw-surface').css('cursor', 'url("'+this.canvas.toDataURL()+'"),auto');
	ctx.clearRect(0,0,this.width, this.height);
	ctx.drawImage(this.canvas, 0, 0);
};

Cdraw_brush.prototype.build_canvas = function() {
	if (!this.need_redraw) {
		return false;
	}
	this.canvas = get_drawing_brush_circle(this);
	this.ctx = this.canvas.getContext('2d');
	return true;
};

Cdraw_brush.prototype.to_s = function() {
	var str = '* Cdraw_brush\n';
	for (k in this) {
		if (!this.hasOwnProperty(k)) {
			continue;
		}
		str += ' - ' + k + ' => ' + this[k] + "\n";
	}
	return str;
};
