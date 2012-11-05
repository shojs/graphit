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