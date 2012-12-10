



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
    	step = 1;
	var points = new Array();
	var v = new Cvector2d();
	v.from_point(A, B);
	var distance = v.magnitude();
	if (distance == 0) { return points; }
	v.normalize();
	var lp = A.clone();
	v.smul(step);
	points.push(A);
	for ( var i = 0; i <= distance; i += step) {
	    lp.vadd(v);
	    points.push(new Cpoint2d(lp));
	}
	points.push(B);
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
