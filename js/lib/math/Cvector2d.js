/**
 * A 2d vector
 * @param {x, y} Position must be an object with x and y properties
 */
function Cvector2d(pos) {
    Cpoint2d.call(this, pos);
}

Cvector2d.prototype = Object.create(Cpoint2d.prototype);
Cvector2d.prototype.constructor = new Cpoint2d();

Cvector2d.prototype.magnitude = function() {
    if (this.x == 0 && this.y == 0)
	return 0;
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
};

Cvector2d.prototype.normalize = function() {
    var m = this.magnitude();
    if (m == 0)
	return this;
    this.x /= m;
    this.y /= m;
    return this;
};

Cvector2d.prototype.from_point = function(a, b) {
    this.x = b.x - a.x;
    this.y = b.y - a.y;
    return this;
};

Cvector2d.prototype.smul = function(s) {
    this.x *= s;
    this.y *= s;
    return this;
};

Cvector2d.prototype.vadd = function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
};

Cvector2d.prototype.clone = function() {
    return new Cvector2d(this);
};