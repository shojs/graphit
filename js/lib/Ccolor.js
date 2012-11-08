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
	// this.a = color.a;
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