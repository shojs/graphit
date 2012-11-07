function callback_stub () {
	;//console.log('callback - stub');
}

function isInt(n) {
	return typeof n === 'number' && n % 1 == 0;
}

function helper_get_classname(obj) {
	if (typeof obj === "undefined")
		return "undefined";
	if (obj === null)
		return "null";
	return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
}

function helper_bound_value (val, min, max) {
	if (val <= min) val = min;
	else if (val >= max) val = max;
	return Math.floor(val);
}

function Cvector2d(x, y) {
	this.x = x;
	this.y = y;
}

function Cpoint (x, y) {
	this.x = x;
	this.y = y;
}

function geom_distance(a, b) {
	return Math.sqrt((b.x - a.x)*(b.x - a.x)) + ((b.y - a.y)*(b.y - a.y));
}

var near_zero_tolerance = 0.01;
function near_zero (v) {
	//console.log('Near zero:', v);
	if (v < near_zero_tolerance && v > - near_zero_tolerance) {
		//console.log('true');
		return true;
	}
	//console.log('false');
	return false;
}