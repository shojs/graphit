function Cgrid(options) {
    Cobject.call(this, options, ['parent', 'callback_slide', 'callback_change']);
}

Cgrid.prototype = Object.create(Cobject.prototype);
Cgrid.prototype.constructor = new Cobject();

Cgrid.prototype.init = function() {
    console.log('Init grid');
    this.color = this.color || new Ccolor(0,0,0,1);
    this.isVisible = this.isVisible || true;
    this.parameters = {
	    width: new Cparameter_numeric({parent: this, label: 'width', min: 1, max: 100, def: 10, step:1}),
	    height: new Cparameter_numeric({parent: this, label: 'height', min: 1, max: 100, def: 10, step:1}),
	    lineWidth: new Cparameter_numeric({parent: this, label: 'lineWidth', min: 1, max: 10, def: 1, step:1}),
    };
    this.label = 'grid';
    this.rootElm = null;
};

Cgrid.prototype.draw = function(dcanvas, sx, sy, width, height) {
  var ctx = dcanvas.getContext('2d');
  ctx.save();
  ctx.beginPath();
  var width = this.get_parameter('width');
  var height = this.get_parameter('height');
  for (var x = width + 1; x < dcanvas.width; x+= width) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, dcanvas.height);
  }
  for (var y = height + 1; y < dcanvas.height; y+= height) {
      ctx.moveTo(0, y);
      ctx.lineTo(dcanvas.width, y);
  }
  ctx.closePath();
  ctx.strokeStyle = this.color.to_rgba();
  ctx.lineWidth = this.get_parameter('lineWidth');
  ctx.stroke();
  ctx.restore();
};

Cgrid.prototype.dom_build = function() {
    var r = $('<div />');
    r.attr('title', this.label);
    r.addClass('grid');
    var g = $('<div />');
    g.addClass('group');
    for (label in this.parameters) {
	var param = this.parameters[label];
	if ('callback_change' in this) {
	    param.callback_change = this.callback_change;
	}
	if ('callback_slide' in this) {
	    param.callback_slide = this.callback_slide;
	}
	if (param.type == undefined || param.type == Eparameter_type.numeric) {
	    widget_slider_ex(param, g, param);
	} else if (param.type == Eparameter_type.select) {
	    // console.log('Build select parameter');
	    widget_select_ex(g, param);

	} else {
	    console.error('Unknow parameter type', param.type);
	    return null;
	}
    }
    r.append(g);
    r.dialog({ resizable: false});
    this.rootElm = r;
    return this;
};



