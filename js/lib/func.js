//Array.prototype.remove = function(from, to) {
//  var rest = this.slice((to || from) + 1 || this.length);
//  this.length = from < 0 ? this.length + from : from;
//  return this.push.apply(this, rest);
//};

function callback_stub() {
	;// console.log('callback - stub');
}
function helper_get_classname(obj) {
	if (typeof obj === "undefined")
		return "undefined";
	if (obj === null)
		return "null";
	return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
}

function helper_bound_value(val, min, max) {
	if (val <= min)
		val = min;
	else if (val >= max)
		val = max;
	return Math.floor(val);
}

var near_zero_tolerance = 0.01;
function near_zero(v) {
	// console.log('Near zero:', v);
	if (v < near_zero_tolerance && v > -near_zero_tolerance) {
		// console.log('true');
		return true;
	}
	// console.log('false');
	return false;
}

function helper_format_number_length(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}