/**
 * @param cBrush
 * @returns
 */
function Cwidget_draw_brush(cBrush) {
	if (!(cBrush instanceof Cdraw_brush)) {
		console
				.error("Cwidget_draw_brush need a Cdraw_brush as first paramater");
		console.log(brush);
		return null;
	}
	this.cBrush = cBrush;
	this.rootElm = null;
	return this;
}

/**
 * 
 * @param $parent
 */
Cwidget_draw_brush.prototype._build_header = function($parent) {
	var root = document.createElement('div');
	var $r = $(root);
	$r.addClass('brush ' + DRAWGLOB.css_draggable_class);
	$r.append("Brush");
	$parent.append($r);
};

Cwidget_draw_brush.prototype.callback_color_changed = function(rgb) {
	// console.log('Change'); console.log(rgb);
	rgb.a = this.cBrush.color.a;
	this.cBrush.color.set_rgb(rgb);
	DRAWETC.set('draw_brush_color', this.cBrush.color.to_rgba());
	this.cBrush.redraw(this.canvas);
};
/**
 * 
 * @param $parent
 */
Cwidget_draw_brush.prototype._build_image_preview = function($parent) {
	var that = this;
	var $r = $(document.createElement('div'));
	$r.addClass('not-draggable');
	var colorpicker = document.createElement('input');
	this.dom_colorpicker = colorpicker;
	var $cp = $(colorpicker);

	$cp.addClass('var-colorpicker');
	$cp.append('<h6>background</h6>');
	$cp.ColorPicker({});
	$cp.css('z-index', 1000);
	// $r.append($cp);
	var $preview = $(document.createElement('div'));
	$preview.addClass('image-preview-group');
	var canvas_dom = document.createElement('canvas');
	this.canvas = canvas_dom;
	var $canvas = $(canvas_dom);
	$canvas.attr('width', this.cBrush.width);
	$canvas.attr('height', this.cBrush.height);
	$canvas.addClass('image-preview');
	$preview.append($canvas);
	$preview.ColorPicker({
		onChange : function(hsb, hex, rgb) {
			that.callback_color_changed(rgb);
		},
		onSubmit : function(hsb, hex, rgb) {
			that.callback_color_changed(rgb);
		}
	});
	$r.append($preview);
	var colors = new Cdraw_colors();
	$r.append(colors.dom_get());
	$parent.append($r);
};

/**
 * 
 * @returns {Cwidget_draw_brush}
 */
Cwidget_draw_brush.prototype.build = function() {
	var that = this;
	var root = document.createElement('div');
	var $r = $(root);
	$r.addClass('widget_draw_brush ' + DRAWGLOB.css_draggable_class);
	helper_build_header($r, 'brush', 'Brush');
	this._build_image_preview($r);
	var $slidergroup = $(document.createElement('div'));
	$slidergroup.addClass('not-draggable');
	var func_draw = function() {
		that.cBrush.redraw(that.canvas);
	};
	var callbacks_size = new Object({
		change : function(e, value) {
			that.cBrush.set_size(value);
			func_draw();
		},
		slide : function(e, value) {
			that.cBrush.set_size(value);
			func_draw();
		}
	});
	var callbacks_opacity = new Object({
		change : function(e, value) {
			that.cBrush.set_opacity(value);
			func_draw();
		},
		slide : function(e, value) {
			that.cBrush.set_opacity(value);
			func_draw();
		}
	});
	var callbacks_rotation = new Object({
		change : function(e, value) {
			that.cBrush.set_rotation(value);
			func_draw();
		},
		slide : function(e, value) {
			that.cBrush.set_rotation(value);
			func_draw();
		}
	});
	var callbacks_pression = new Object({
		change : function(e, value) {
			that.cBrush.set_pression(value);
			func_draw();
		},
		slide : function(e, value) {
			that.cBrush.set_pression(value);
			func_draw();
		}
	});
	widget_slider_ex($slidergroup, 'size', {
		min : 1,
		max : 100,
		step : 1,
		value : this.cBrush.size
	}, callbacks_size);
	widget_slider_ex($slidergroup, 'opacity', {
		min : 0,
		max : 1,
		step : 0.01,
		value : this.cBrush.color.a
	}, callbacks_opacity);
	widget_slider_ex($slidergroup, 'pression', {
		min : 1,
		max : 100,
		step : 1,
		value : this.cBrush.pression
	}, callbacks_pression);
	widget_slider_ex($slidergroup, 'rotation', {
		min : 0,
		max : 90,
		step : 1,
		value : this.cBrush.rotation
	}, callbacks_rotation);
	$r.append($slidergroup);
	func_draw();
	this.rootElm = $r;
	return this;
};

/**
 * 
 * @returns
 */
Cwidget_draw_brush.prototype.get_dom = function() {
	if (!this.rootElm) {
		this.build();
	}
	return this.rootElm;
};