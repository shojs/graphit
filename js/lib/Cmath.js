/**
 * A point in space
 * @param x
 * @param y
 * @returns
 */
function Cpoint(pos) {
	pos = pos || {x: 0, y: 0};
    this.x = pos.x;
    this.y = pos.y;
}

/**
 * A 2d vector
 * @param x
 * @param y
 * @returns
 */
function Cvector2d(pos) {
    Cpoint.call(this, pos);
}

Cvector2d.prototype = Object.create(Cpoint.prototype);
Cvector2d.prototype.constructor = new Cpoint();

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

/**
 * Global math Object
 */
var cMath = {
	/**
	 * Return distance between point A and B
	 * @param A
	 * @param B
	 * @returns
	 */
    distance : function(A, B) {
	var intx = B.x - A.x;
	var inty = B.y - A.y;
	return Math.sqrt(intx * intx) + (inty * inty);
    },
    /**
     * Check that n is an integer
     * @param n
     * @returns {Boolean}
     */
    isint : function(n) {
	return typeof n === 'number' && n % 1 == 0;
    },
    /**
     * Return interpolated list of points
     * 
     * @param p1
     * @param p2
     * @param step
     * @returns points
     */
    linear_interpolation : function(A, B, step) {
	var points = new Array();
	var v = new Cvector2d();
	v.from_point(A, B);
	var distance = v.magnitude();
	if (distance == 0) {
	    return points;
	}
	v.normalize();
	var lp = A.clone();
	v.smul(step);
	var nstep = step;// distance / step;
	//console.log('distance', distance, 'nstep:', nstep);
	points.push(A);
	for ( var i = 0; i <= distance; i += step) {
	    lp.vadd(v);
	    points.push(new Cpoint(lp.x, lp.y ));
	}
	points.push(B);
	//console.log(points);
	return points;
    },
    /**
     * Return borned value: lo < value < hi
     * @param value
     * @param lo
     * @param hi
     * @returns
     */
    clamp : function(value, lo, hi) {
	return value < lo ? lo : value > hi ? hi : value;
    }
};
