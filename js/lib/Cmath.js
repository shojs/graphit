function Cpoint(x, y) {
	this.x = x;
	this.y = y;
}

function Cvector2d(x, y) {
	Cpoint.call(this, x, y);
}

Cvector2d.prototype = Object.create(Cpoint.prototype);
Cvector2d.prototype.constructor = new Cpoint();


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
