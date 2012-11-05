/**
 * @author joachim basmaison <joachim.basmaison [AT] GOOGLE>
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
	var root = document.createElement('h6');
	var $r = $(root);
	$r.addClass('header');
	$r.append("Brush");
	$parent.append($r);
};

/**
 * 
 * @param $parent
 */
Cwidget_draw_brush.prototype._build_image_preview = function($parent) {
	var $r = $(document.createElement('div'));
	$r.addClass('image-preview-group');
	var canvas_dom = document.createElement('canvas');
	this.canvas = canvas_dom;
	var $canvas = $(canvas_dom);
	$canvas.attr('width', this.cBrush.width);
	$canvas.attr('height', this.cBrush.height);
	$canvas.addClass('image-preview');
	$r.append($canvas);
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
	$r.addClass('widget_draw_brush draggable');
	this._build_header($r);
	this._build_image_preview($r);
	var $slidergroup = $(document.createElement('div'));
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

	widget_slider_ex($slidergroup, 'size', {
		min : 1,
		max : 100,
		step : 1,
		value : 20
	}, callbacks_size);
	widget_slider_ex($slidergroup, 'opacity', {
		min : 0,
		max : 100,
		step : 1,
		value : 100
	}, callbacks_opacity);
	widget_slider_ex($slidergroup, 'rotation', {
		min : 0,
		max : 90,
		step : 1,
		value : 0
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