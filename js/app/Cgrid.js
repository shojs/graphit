function Cgrid(options) {
    this.className = 'Cgrid';
    this.label = 'grid';
    Cobject.call(this, options, ['parent', 'callback_slide', 'callback_change']);
}

Cgrid.prototype = Object.create(Cobject.prototype);
Cgrid.prototype.constructor = new Cobject();

Cgrid.prototype.init = function() {
    //console.log('Init grid');
    this.color = this.color || new Ccolor(0,0,0,1);
    this.isVisible = this.isVisible || true;
    // TODO: Parameters are not auto loaded
    // TODO: Too tricky ...
    var that = this;
    var change = function() {
	console.log('Change');
	$(document).trigger('shojs-surface-update', ['grid-option-change']);
    };
    var parent = { className: this.className, label: this.label};
    this.parameters = {
	    width: new Cparameter_numeric({parent: parent, label: 'width', min: 1, max: 100, def: 100, step:1, callback_change: change, callback_slide: change}),
	    height: new Cparameter_numeric({parent: parent, label: 'height', min: 1, max: 100, def: 100, step:1, callback_change: change, callback_slide: change}),
	    lineWidth: new Cparameter_numeric({parent: parent, label: 'lineWidth', min: 1, max: 10, def: 1, step:1, callback_change: change, callback_slide: change}),
	    visibility: new Cparameter_checkbox({parent: parent, type: Eparameter_type.checkbox, label: 'visibility', def: true, callback_change: change}),
    };
    for (p in this.parameters) {
	this.parameters[p]._init();
    }
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
	r.append(param.dom_get());
    }
    r.append(g);
    r.dialog({ resizable: false, width: 250});
    this.rootElm = r;
    return this;
};



