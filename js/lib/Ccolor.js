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

Ccolor.prototype.set = function(color) {
	this.r = color.r;
	this.g = color.g;
	this.b = color.b;
	this.a = color.a;
};
