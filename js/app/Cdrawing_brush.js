function isInt(n) {
   return typeof n === 'number' && n % 1 == 0;
}

function Cdraw_frag(parent, width, height) {
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width', width);
	this.canvas.setAttribute('height', height);
	this.ctx = this.canvas.getContext('2d');
	this.x = null;
	this.y = null;
};

Cdraw_frag.prototype.drawImage = function(canvas, sx, sy, swidth, sheight, tx, ty) {
	if ( tx > swidth || tx < 0) {
		console.error('x position out of bound');
		return false;
	} else if (ty > sheight || ty < 0) {
		console.error('y position out of bound');
		return false;
	}
	this.x = tx;
	this.y = ty;
	//console.log('Drawing image: ' + tx + ', ' + ty);
	this.ctx.drawImage(canvas, sx, sy, swidth, sheight, tx, ty, swidth, sheight);
	//document.getElementById('img-preview').src = this.canvas.toDataURL();
	return true;
};

function Cdraw_layer(parent, label) {
	this.parent = parent;
	this.label = label;
	this.frags = new Array();
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width', parent.width);
	this.canvas.setAttribute('height', parent.height);
	this.ctx = this.canvas.getContext('2d');
	this.need_redraw = true;
};

Cdraw_layer.prototype.redraw = function() {
	if (!this.need_redraw) { return false;}
	for(var i = this.frags.length - 1; i >= 0; i--) {
		var f = this.frags[i];
//		console.log(f);
//		console.log(this);
//		console.log('i: ' + i);
		this.ctx.drawImage(f.canvas, 0, 0, f.canvas.width, f.canvas.height, f.x, f.y, f.canvas.width, f.canvas.height);
	}
	this.need_redraw = false;
	return true;
};

Cdraw_layer.prototype.get_canvas = function() {
	this.redraw();
	return this.canvas;
};

Cdraw_layer.prototype.drawImage = function(canvas, sx, sy, swidth, sheight, tx, ty) {
	var frag = new Cdraw_frag(this, swidth, sheight);
	frag.drawImage(canvas, sx, sy, swidth, sheight, tx, ty);
	this.frags.push(frag);
};

var E_LAYERLABEL = new Object({
	current: 1,
	mouse: 2,
	grid: 3,
});

function Cdraw_surface(width, height) {
	this.width = width;
	this.height = height;
	this.layer_mouse = new Cdraw_layer(this, E_LAYERLABEL.mouse);
	this.layer_grid = new Cdraw_layer(this, E_LAYERLABEL.grid); 
	this.layers = new Array();
	this.set_current_layer(this.layer_grid);
}



Cdraw_surface.prototype.set_current_layer = function(layer) {
	this.layer_current = layer;
};

Cdraw_surface.prototype.get_layer = function(label) {
	if (!label || label == E_LAYERLABEL.current) return this.layer_current;
	if (isInt(label)) {
		return this.layers[label];
	}
	if (label == E_LAYERLABEL.mouse) return this.layer_mouse;
	if (label == E_LAYERLABEL.grid) return this.layer_grid;
};

Cdraw_surface.prototype.add_layer = function() {
	var layer = new Cdraw_layer(this, 'layer');
	this.layers.push(layer);
	return layer;
};





/**
 * 
 * @param r
 * @param g
 * @param b
 * @param a
 * @returns
 */
function Ccolor(r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
}
Ccolor.prototype.to_rgba = function() {
	return 'rgba('+this.r+','+this.g+','+this.b+','+this.a+')';
};

function Cwidget_slider_ex ($parent, label, options, callbacks) {
		//var $that = this;
		var root = document.createElement('div');
		var $r = $(root);
		$r.addClass('sliderex ' + label);
		$r.append('<h6>'+label+'</h6>');
		var $input = $(document.createElement('input'));
		$input.addClass('input');
		$input.attr('value', options.value);
		$input.css('width: 2em');
		$input.change(function() {
			$this = $(this);
			var value = $this.attr('value');
			var $p = $this.parent().children('div.slider');
			$p.slider('option', 'value', value);
			callbacks.change(this, value);
		});
		$r.append($input);
		var $slider = $(document.createElement('div'));
		$slider.addClass('slider');
		$slider.slider({min: options.min, max: options.max, value: options.value, step:options.step,
			slide: function() {
				var $this = $(this);
				var value = $this.slider('option', 'value');
				var $p = $this.parent().children('input.input');
				$p.attr('value', value);
				callbacks.slide(this, value);
			},
			change: function() {
				var $this = $(this);
				var value = $this.slider('option', 'value');
				var $p = $this.parent().children('input.input');
				$p.attr('value', value);
				callbacks.change(this, value);
			}
		});
		$r.append($slider);
		$parent.append($r);
}

function Cwidget_draw_brush (cBrush) {
	if (!(cBrush instanceof Cdrawing_brush)) {
		console.error("Cwidget_draw_brush need a Cdrawing_brush as first paramater");
		console.log(brush);
		return null;
	}
	this.cBrush = cBrush;
	this.rootElm = null;
	return this;
}

Cwidget_draw_brush.prototype._build_header = function($parent) {
	var root = document.createElement('h6');
	var $r = $(root);
	$r.addClass('header');
	$r.append("Brush");
	$parent.append($r);
};

Cwidget_draw_brush.prototype._build_image_preview = function($parent) {
	var $r = $(document.createElement('div'));
	$r.addClass('image-preview-group');
	var canvas_dom = document.createElement('canvas');
	this.canvas = canvas_dom;
	var $canvas = $(canvas_dom);
	//$r.append('<h7>preview</h7>');
	$canvas.attr('width', this.cBrush.width);
	$canvas.attr('height', this.cBrush.height);
	//$r.src = 'img/brush-preview.png';
	$canvas.addClass('image-preview');
	$r.append($canvas)
	$parent.append($r);
};

Cwidget_draw_brush.prototype.build = function() {
	var that = this;
	var root = document.createElement('div');
	var $r = $(root);
	$r.addClass('widget_draw_brush draggable');
	this._build_header($r);
	this._build_image_preview($r);
	var $slidergroup = $(document.createElement('div'));
	//this._build_size($r);
	var func_draw = function() {
		that.cBrush.redraw(that.canvas);
	};
	var callbacks_size = new Object({
		change: function(e, value) { that.cBrush.set_size(value); func_draw();},	
		slide: function(e, value) { that.cBrush.set_size(value); func_draw();}
	});
	var callbacks_opacity = new Object({
		change: function(e, value) { that.cBrush.set_opacity(value); func_draw();},	
		slide: function(e, value) { that.cBrush.set_opacity(value); func_draw();}
	});
	var callbacks_rotation = new Object({
		change: function(e, value) { that.cBrush.set_rotation(value); func_draw();},	
		slide: function(e, value) { that.cBrush.set_rotation(value); func_draw();}
	});

	Cwidget_slider_ex ($slidergroup, 'size', {min: 1, max: 100, step: 1, value: 20}, callbacks_size);
	Cwidget_slider_ex ($slidergroup, 'opacity', {min: 0, max: 100, step: 1, value: 100}, callbacks_opacity);
	Cwidget_slider_ex ($slidergroup, 'rotation', {min: 0, max: 90, step: 1, value: 0}, callbacks_rotation);
	$r.append($slidergroup);
	func_draw();
	this.rootElm = $r;
	return this;
};

Cwidget_draw_brush.prototype.get_dom = function() {
	if (!this.rootElm) { this.build(); }
	return this.rootElm;
};
/**
 * 
 */
var E_BRUSHSHAPE = new Object({
	circle: 1,
});

function get_drawing_brush_general(oBrush) {
	var canvas = document.createElement('canvas');
	canvas.setAttribute('width', oBrush.width);
	canvas.setAttribute('height', oBrush.height);
	return canvas;
}

function get_drawing_brush_circle (oBrush){
	var canvas = get_drawing_brush_general(oBrush);
	var x = Math.floor(oBrush.width / 2);
	var y = Math.floor(oBrush.height / 2);
	var r = Math.floor(oBrush.size / 2);
	
	//console.log({x: x, y: y, r: r});
	helper_draw_circle (canvas, x, y, r, oBrush.color.to_rgba());
	return canvas;
}


function helper_alphaper2hex (alpha) {
	var v = Math.floor(alpha * (1 * (255 / 100)));
	//console.log('v: ' + v);
	return v;
}

function Cdrawing_brush() {
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

Cdrawing_brush.prototype.set_rotation = function(rotation) {
	this.rotation = rotation;
	this.need_redraw = true;
};

Cdrawing_brush.prototype.set_opacity = function(opacity) {
	this.opacity = opacity;
	this.color.a = helper_alphaper2hex(this.opacity);
	this.need_redraw = true;
};

Cdrawing_brush.prototype.set_size = function(size) {
	this.size = size;
	this.need_redraw = true;
};
	
Cdrawing_brush.prototype.redraw = function(canvas) {
	if (this.build_canvas()) {
		this.drawing(canvas, 0, 0);
	}
};

Cdrawing_brush.prototype.drawing = function(tcanvas, tx, ty) {
	var ctx = tcanvas.getContext('2d');
	ctx.fillStyle = 'rgba(255,255,255,255)';
	ctx.fillRect(0,0, this.width, this.height);
	ctx.drawImage(this.canvas, 0, 0);
};

Cdrawing_brush.prototype.build_canvas = function() {
	if (!this.need_redraw) {
		return false;
	}
	this.canvas = get_drawing_brush_circle(this);
	this.ctx = this.canvas.getContext('2d');
	return true;
};

Cdrawing_brush.prototype.to_s = function() {
	var str = '* Cdrawing_brush\n';
	for (k in this) {
		if (!this.hasOwnProperty(k)) {
			continue;
		}
		str += ' - ' + k + ' => ' + this[k] + "\n";
	}
	return str;
};

