/**
 * A class holding a canvas element
 * @param options
 * @returns
 */
function Ccanvas(options) {
    if (!options) {
	console.error('Missing << {} >> parameter for Ccanvas');
    }
    if (!('bg_color' in options) || !(options.bg_color instanceof Ccolor)) {
	options.bg_color = new Ccolor(0, 0, 0, 0);
    }
    options.className = 'Ccanvas';
    options.label = 'canvas';
    Cobject.call(this, options, ['width', 'height', 'bg_color', 'src']);
    this.data = document.createElement('canvas');
    this.data.setAttribute('width', this.width);
    this.data.setAttribute('height', this.height);
    this.ctx = this.data.getContext('2d');
    this.clear(this.bg_color);
    if (this.src) {
	this.load(this.src);
    }
};

Ccanvas.prototype = Object.create(Cobject.prototype);
Ccanvas.prototype.constructor = new Cobject();

Ccanvas.prototype.clone = function() {
    var c = new Ccanvas({
	width: this.width, 
	height: this.height, 
	bg_color: this.bg_color });
    c.copy(this);
    return c;
};

Ccanvas.prototype.get_width = function() {
    return this.data.width;
};

Ccanvas.prototype.get_height = function() {
    return this.data.height;
};

Ccanvas.prototype.copy = function(cCanvas, bResize) {
    var ctx = this.data.getContext('2d');
    if (bResize != 'undefined' && bResize) {
	ctx.drawImage(cCanvas.data, 0, 0, cCanvas.get_width(), cCanvas.get_height(), 0,0, this.get_width(), this.get_height());
    } else {
	var dwidth = cCanvas.get_width() > this.get_width()? this.get_width(): cCanvas.get_width();
	var dheight = cCanvas.get_height() > this.get_height()? this.get_height(): cCanvas.get_height();
	var offx = (this.get_width() > dwidth)? (this.get_width() - dwidth)/2 : 0;
	var offy = (this.get_height() > dheight)? (this.get_height() - dheight)/2 : 0;
	ctx.drawImage(cCanvas.data, 0, 0, dwidth, dheight, offx, offy, dwidth, dheight);
    };
};

Ccanvas.prototype.get_pixel_color = function(data, x, y, Ecolor) {
    return data.data[((x * (data.width * 4)) + (y * 4) + Ecolor)];
};

Ccanvas.prototype.getCanvas = function() {
    return this.data;
};

Cobject.prototype.getContext = function(type) {
    type = type || '2d';
    if ('data' in this) {
	return this.data.getContext(type);
    }
    console.error('Cannot return context for this object... no cCanvas');
    return null;
};

Ccanvas.prototype.clear = function(color) {
    color = color || new Ccolor(0,0,0,0);
    var ctx = this.getContext();
    if (color.a == 0) {
	ctx.clearRect(0, 0, this.data.width, this.data.height);
    } else {
	ctx.save();
	ctx.fillStyle = color.to_rgba();
	ctx.fillRect(0, 0, this.data.width, this.data.height);
	ctx.restore();
    }
};

Ccanvas.prototype.save = function() {
    var data = this.data.toDataURL('image/png');
    if (!window.open(data)) {
	document.location.href = data;
    }
};

var Ergb_color = {
    red : 0,
    green : 1,
    blue : 2,
    alpha : 3,
};


Ccanvas.prototype.select_by_color = function(color) {
    console.log('Selecting by color', color);
    // var ctx = this.ctx;
    // blueComponent = imageData.data[((50*(imageData.width*4)) + (200*4)) + 2];
    var data = this.ctx.getImageData(0, 0, this.data.width, this.data.height);
    this.ctx.save();
    this.ctx.beginPath();
    var total = 0;
    var c = null;
    var width = data.width;
    var height = data.height;
    var pixel = [];
    var dc = document.createElement('canvas');
    dc.width = width;
    dc.height = height;
    var dcx = dc.getContext('2d');
    dcx.fillStyle = 'rgba(0,0,0,1)';
    dcx.clearRect(0, 0, width, height);
    dcx.translate(-0.5, -0.5);
    for ( var i = 0; i < height; i += 1) {
	var msg = 'scan line ' + j;
	for ( var j = 0; j < width; j += 1) {
	    // console.log(Ergb_color.alpha);
	    if ((Math
		    .round((this.get_pixel_color(data, i, j, Ergb_color.alpha) / 255) * 100) / 100) != color.a) {
		// console.log('alpha buh', c);
		continue;
	    }
	    if (this.get_pixel_color(data, i, j, Ergb_color.red) != color.r) {
		// console.log('red buh', c + 1);
		continue;
	    }
	    if (this.get_pixel_color(data, i, j, Ergb_color.green) != color.g) {
		continue;
	    }
	    if (this.get_pixel_color(data, i, j, Ergb_color.blue) != color.b) {
		continue;
	    }
	    dcx.save();
	    dcx.translate(j, i);
	    dcx.fillRect(0, 0, 1, 1);
	    dcx.restore();
	    // pixel.push( {i: i, j: j} );
	    // var p = this.get_pixe(data, i, j);
	    // var c = new Ccolor().from_pixel(data, i, j);
	    // console.log(c);
	    // if (c.equal(color)) {
	    // if (!this.ctx.isPointInPath(i, j)) {
	    // this.ctx.lineTo(i, j);
	    total++;
	    // }
	    // console.log('Found similar color', i, j);
	    // }
	}

	// console.log(msg);

    }
    console.log('total line', total, pixel);
    // console.log(dc.toDataURL());
    var inv = new Ccanvas(width, height, new Ccolor(0, 0, 0, 1));
    // inv.to_bitmask(dc);
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(dc, 0, 0, width, height);
    this.ctx.restore();
    // blueComponent = imageData.data[((50*(imageData.width*4)) + (200*4)) + 2];
};

Ccanvas.prototype.to_bitmask = function(src) {
    console.log(src);
    var can, idat, dcx, data;
    var width, height;
    if (src) {
	can = src;
	dcx = src.getContext('2d');
	idat = dcx.getImageData(0, 0, src.width, src.height);
	width = src.width;
	height = src.height;
    } else {
	can = this.data;
	dcx = this.ctx;
	idat = this.ctx.getImageData(0, 0, this.data.width, this.data.height);
	width = this.data.width;
	height = this.data.heignt;
    }
    var data = idat.data;
    var alpha = null;
    dcx.save();
    dcx.fillStyle = 'rgba(0,1,1,1)';
    dcx.clearRect(0, 0, width, height);
    dcx.translate(-0.5, -0.5);
    for ( var i = 0; i < height; i += 1) {
	var msg = 'scan line ' + j;
	for ( var j = 0; j < width; j += 1) {
	    alpha = this.get_pixel_color(idat, i, j, Ergb_color.alpha) / 255;
	    // console.log(Ergb_color.alpha);
	    dcx.save();
	    dcx.translate(j, i);
	    if (alpha == 1) {
		dcx.clearRect(0, 0, 1, 1);

		// console.log('alpha buh', c);
	    } else {
		dcx.fillRect(0, 0, 1, 1);
		// = 'rgba(0,0,0,0)';
	    }
	    dcx.restore();
	}
    }
    dcx.restore();
    this.ctx.clearRect(0, 0, this.data.width, this.data.height);
    this.ctx.drawImage(can, 0, 0, width, height);

};

Ccanvas.prototype.load = function(src) {
    var that = this;
    this.image_loading = new Cimage({
	src : src,
	callback_onload : function() {
	    console.log('Image loaded', this);
	    var w = cMath.clamp(1, this.rootElm.width, that.data.width);
	    var h = cMath.clamp(1, this.rootElm.height, that.data.height);
	    that.data.getContext('2d').drawImage(
		    this.rootElm, 0, 0,
		    w, h);
	    that.image_loading = null;
	},
	callback_onerror : function() {
	    console.log('Failed to load image', this);
	    that.image_loading = null;
	}
    });
};

Ccanvas.prototype.dom_build = function() {
   this.rootElm = this.data;
   return this;
};

