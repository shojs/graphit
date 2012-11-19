function Ccanvas(width, height, background_color) {
    //console.log('Creating new Ccanvas WxH', width, height);
    if (background_color instanceof Ccolor) {
	this.background_color = background_color;
    } else {
	this.background_color = new Ccolor(0, 0, 0, 0);
    }
    this.data = document.createElement('canvas');
    this.data.setAttribute('width', width);
    this.data.setAttribute('height', height);
    this.ctx = this.data.getContext('2d');
    this.clear(this.background_color);
};

Ccanvas.prototype.getContext = function(type) {
    if (!type) {
	type = '2d';
    }
    return this.data.getContext(type);
};

Ccanvas.prototype.getCanvas = function() {
    return this.data;
}

Ccanvas.prototype.clear = function(color) {
    if (color instanceof Ccolor) {
	this.background_color = color;
    }
    if (this.background_color.a == 0) {
	this.ctx.clearRect(0, 0, this.data.width, this.data.height);
    } else {
	this.ctx.save();
	this.ctx.fillStyle = this.background_color.to_rgba();
	this.ctx.fillRect(0, 0, this.data.width, this.data.height);
	this.ctx.restore();
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

Ccanvas.prototype.get_pixel_color = function(data, x, y, Ecolor) {
    return data.data[((x * (data.width * 4)) + (y * 4) + Ecolor)];
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
    //inv.to_bitmask(dc);
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
		dcx.clearRect(0,0,1,1);

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

Ccanvas.prototype.clear = function(color) {
    if (!(color instanceof Ccolor)) {
	console.error('Fist parameter is not a Ccolor instance');
	return false;
    }
    if (color.a == 0) {
	this.ctx.clearRect(0, 0, this.data.width, this.data.height);
    } else {
	this.ctx.fillStyle = color.to_rgba();
	this.ctx.fillRect(0, 0, this.data.width, this.data.height);
    }
    return true;

};