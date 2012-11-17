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
	return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
};

Ccolor.prototype.set_rgb = function(color) {
	this.r = color.r;
	this.g = color.g;
	this.b = color.b;
	this.a = 1;
	return this;
};

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

Ccolor.prototype.clone = function() {
    return new Ccolor(this.r, this.g, this.b, this.a);
};

Ccolor.prototype.equal = function(c) {
    //console.log(c, this);
    var checks = ['a', 'r', 'g', 'b'];
    var component;
    for (var i = 0; i < checks.length; i++) {
	component = checks[i];
	//console.log('check component: ',component,  this[component], c[component]);
	if (this[component] != c[component]) {
	    return false;
	}
    }
    return true;
};

Ccolor.prototype.magnitude = function() {
    return Math.sqrt((this.r*this.r) + (this.g*this.g) + (this.b*this.b));
};

Ccolor.prototype.normalize = function() {
    var m = this.magnitude();
    this.r /= m;
    this.b /= b;
    this.g /= g;
    return this;
};