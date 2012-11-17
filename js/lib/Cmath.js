function Cpoint(x, y) {
	this.x = x;
	this.y = y;
}

function Cvector2d(x, y) {
    Cpoint.call(this, x, y);
}

Cvector2d.prototype = Object.create(Cpoint.prototype);
Cvector2d.prototype.constructor = new Cpoint();

Cvector2d.prototype.magnitude = function() {
    if (this.x == 0 && this.y == 0) return 0;
    //console.log(this.x, this.y);
    return Math.sqrt((this.x*this.x) + (this.y*this.y));
};

Cvector2d.prototype.normalize = function() {
    var m = this.magnitude();
    if (m == 0) return this;
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
   return new Cvector2d(this.x, this.y);
};

var cMath = {
	distance: function(A, B) {
		var intx = B.x - A.x;
		var inty = B.y - A.y;
		return Math.sqrt(intx * intx) + (inty * inty);
	},
	isint: function(n) {
		return typeof n === 'number' && n % 1 == 0;
	},
    clamp: function(value, lo, hi) {
        return value < lo ? lo : value > hi ? hi : value;
    }
};
