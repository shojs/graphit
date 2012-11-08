/*******************************************************************************
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
	var r = Math.floor(oBrush.size / 2);
	helper_draw_circle(canvas, r, r, r, oBrush.color.to_rgba());
	return canvas;
}

/*******************************************************************************
 * 
 * @param alpha
 * @returns {Number}
 */
function helper_alphaper2hex(alpha) {
	var v = alpha / 100;
	console.log('Alpha: ' + v);
	return v;
}

/*******************************************************************************
 * 
 * @returns
 */
function Cdraw_brush() {
	this.width = 100;
	this.height = 100;
	var c = DRAWETC.get_set('draw_brush_color', 'rgba(0,0,0,1)');
	this.color = new Ccolor(0, 0, 0, 1).from_rgba(c);
	this.set_size(DRAWETC.get_set('draw_brush_size', 20));
	this.set_pression(DRAWETC.get_set('draw_brush_pressions', 100));
	this.set_rotation(DRAWETC.get_set('draw_brush_rotation', 20));
	this.need_redraw = true;
	this.canvas = null;
	this.ctx = null;
	this.shape = E_BRUSHSHAPE.circle;
	this.build_canvas();
}

Cdraw_brush.prototype.set_color = function(color) {
	this.color.set_rgb(color);
	DRAWETC.set('draw_brush_color', this.color.to_rgba());
	this.need_redraw = true;
};

Cdraw_brush.prototype.set_pression = function(pression) {
	if (pression == 0) {
		pression = 0.1;
	}
	this.pression = pression;

	DRAWETC.set('draw_brush_pression', this.pression);
	this.need_redraw = true;
};

Cdraw_brush.prototype.set_rotation = function(rotation) {
	this.rotation = rotation;
	DRAWETC.set('draw_brush_rotation', this.rotation);
	this.need_redraw = true;
};

Cdraw_brush.prototype.set_opacity = function(opacity) {
	this.color.a = Math.round(opacity * 100) / 100;
	DRAWETC.set('draw_brush_color', this.color.to_rgba());
	this.need_redraw = true;
};

Cdraw_brush.prototype.set_size = function(size) {
	this.size = parseInt(size);
	$(this.canvas).css('width', size);
	$(this.canvas).css('height', size);
	DRAWETC.set('draw_brush_size', size);
	this.need_redraw = true;
};

Cdraw_brush.prototype.redraw = function(canvas) {
	if (this.build_canvas()) {
		this.drawing(canvas, 0, 0);
	}
};

Cdraw_brush.prototype.drawing = function(tcanvas, tx, ty) {
	var ctx = tcanvas.getContext('2d');
	ctx.clearRect(0, 0, this.width, this.height);
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
