var Ecolor = {
	transparent_black: 'rgba(0,0,0,0)'
};

/**
 * RGBA color object
 * 
 * @param options
 *            {Hash} Cobject parameters hash
 */
function Ccolor(options) {
	options = options || {};
	options.className = 'Ccolor';
	options.label = 'color';
	if (!('r' in options)) options.r = 0;
	if (!('g' in options)) options.g = 0;
	if (!('b' in options)) options.b = 0;
	if (!('a' in options)) options.a = 0;
	Cobject.call(this, options, ['r', 'g', 'b', 'a', 'callback_change']);
}

/* Inheritance */
Ccolor.prototype = Object.create(Cobject.prototype);
Ccolor.prototype.constructor = new Cobject();

/**
 * Convert Ccolor object to rgba string: rgba(r,g,b,a)
 * 
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
	callback = this.callback_exists('change');
	if (callback) callback.call(this);
	return this;
};

Ccolor.prototype.set = function(k, v) {
	callback = this.callback_exists('change');
	if (k instanceof Ccolor) {
		this.r = k.r;
		this.g = k.g;
		this.b = k.b;
		this.a = k.a;
		if (callback) callback.call(this);
		return this;
	} else if (k && (v != undefined)) {
		if (k in this) {
			this[k] = v;
			if (callback) callback.call(this);
			return this;
		}
		throw('invalid_color_key',  k);
	}
    throw ('invalid_set_value', {key: k, value: v});
};

/**
 * Parse rgba string and fill object properties
 * 
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
  var rat = 1.0/255;
  this.r = Math.round((1.0 - (this.r * rat))*255);
  this.g = Math.round((1.0 - (this.g * rat))*255);
  this.b = Math.round((1.0 - (this.b * rat))*255);
  return this;
};

/**
 * Read color from pixel data (context.getImageData.data...)
 * 
 * @param p_data
 *            Our pixel array
 * @param spixel
 *            {Object} Object with x and y property
 * @returns {Ccolor} This Ccolor object
 */
Ccolor.prototype.from_pixel = function(p_data, spixel) {
    if (p_data == undefined || spixel == undefined) {
    	throw ('invalid_argument');
    }
// var x = spixel.x;
// var y = spixel.y;
    var index = (spixel.y*(p_data.width*4)) + (spixel.x*4);
	var data = p_data.data;
    this.r = data[index];
    this.g = data[index + 1];
    this.b = data[index + 2];
    this.a = data[index + 3];
    this.a = Math.round((this.a / 255) * 100) / 100;
    return this;
};

/**
 * Clone Object
 * 
 * @returns {Ccolor}
 */
Ccolor.prototype.clone = function() {
    return new Ccolor(this);
};

/**
 * Compare two color object
 * 
 * @param c
 * @returns {Boolean}
 */
Ccolor.prototype.equal = function(c, p_checks) {
    var checks = p_checks || ['a', 'r', 'g', 'b'];
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
 * 
 * @returns {Ccolor}
 */
Ccolor.prototype.normalize = function() {
    var m = this.magnitude();
    this.r /= m;
    this.b /= b;
    this.g /= g;
    return this;
};

/**
 *
 */
Ccolor.prototype.to_s = function() {
	var nl = "\n";
	var str = this.className + '(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')' + nl;
	return str;
};