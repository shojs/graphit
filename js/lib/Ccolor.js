var Ecolor = {
	transparent_black: 'rgba(0,0,0,0)',
};

/**
 *  RGBA color object
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

/* Convert Ccolor object to rgba string: rgba(r,g,b,a)
 * @return string
 */
Ccolor.prototype.to_rgba = function() {
	return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
};

/*
 * Set rgb color from structure while setting alpha to 1
 */
Ccolor.prototype.set_rgb = function(color) {
	this.r = color.r;
	this.g = color.g;
	this.b = color.b;
	this.a = 1;
	return this;
};

Ccolor.prototype.set = function(k, v) {
    if (k in this) {
	this[k] = v;
	return this;
    }
    console.error('Invalid key', k);
    return null;
}
/**
 * Parse rgba string and fill object properties
 * @param rgba
 * @returns {Ccolor}
 */
Ccolor.prototype.from_rgba = function(rgba) {
	var reg = new RegExp(
			/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+(\.\d+)?)\s*\)$/);
	var match = reg.exec(rgba);
	if (!match) {
		console.error('Invalid rgba expression: ' + rgba);
		return this;
	}
	this.r = match[1];
	this.g = match[2];
	this.b = match[3];
	this.a = match[4];
	return this;
};


Ccolor.prototype.inverse = function() {
    console.log(this);
  var rat = 1.0/255;
  this.r = Math.round((1.0 - (this.r * rat))*255);
  this.g = Math.round((1.0 - (this.g * rat))*255);
  this.b = Math.round((1.0 - (this.b * rat))*255);
  console.log(this);
  return this;
};

/**
 * Read color from pixel data (context.getImageData.data...) 
 * @param p_data Our pixel array
 * @param x X position
 * @param y Y position
 * @returns {Ccolor}
 */
Ccolor.prototype.from_pixel = function(p_data, x, y) {
    //console.log('data', p_data);
    var data = p_data.data;
    this.r = data[ ( (x*(p_data.width*4)) + (y*4) )];
    this.g = data[ ( (x*(p_data.width*4)) + (y*4) + 1)];
    this.b = data[ ( (x*(p_data.width*4)) + (y*4) + 2)];
    this.a = data[ ( (x*(p_data.width*4)) + (y*4) + 3)];
    this.a = Math.round((this.a / 255) * 100) / 100;
    return this;
};

/**
 * Clone Object
 * @returns {Ccolor}
 */
Ccolor.prototype.clone = function() {
    return new Ccolor(this.r, this.g, this.b, this.a);
};

/**
 * Compare two color object
 * @param c
 * @returns {Boolean}
 */
Ccolor.prototype.equal = function(c) {
    var checks = ['a', 'r', 'g', 'b'];
    var component;
    for (var i = 0; i < checks.length; i++) {
	component = checks[i];
	if (this[component] != c[component]) {
	    return false;
	}
    }
    return true;
};

/*
 * Magnitude of color treated like vector v(r,g,b)
 */
Ccolor.prototype.magnitude = function() {
    return Math.sqrt((this.r*this.r) + (this.g*this.g) + (this.b*this.b));
};

/**
 * Normalinzing color... WTF :P
 * @returns {Ccolor}
 */
Ccolor.prototype.normalize = function() {
    var m = this.magnitude();
    this.r /= m;
    this.b /= b;
    this.g /= g;
    return this;
};