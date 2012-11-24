//Array.prototype.remove = function(from, to) {
//  var rest = this.slice((to || from) + 1 || this.length);
//  this.length = from < 0 ? this.length + from : from;
//  return this.push.apply(this, rest);
//};

function callback_stub() {
	;// console.log('callback - stub');
}

function helper_get_classname(obj) {
	if (typeof obj === "undefined") return "undefined";
	if (obj === null) return "null";
	return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
}

function helper_bound_value(val, min, max) {
	if (val <= min) val = min;
	else if (val >= max) val = max;
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

function isCanvasSupported() {
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}

function isFileSupported() {
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		return true;
	} else {
		console.error('The File APIs are not fully supported in this browser.');
	}
}
/**
 * 
 * @param obj
 * @returns
 */
function getObjectClass(obj) {
	if (typeof obj != "object" || obj === null) return false;
	console.log(obj.constructor.toString());
	var pat = /^function (\w+)\(/;
	return pat.exec(obj.constructor.toString())[1];
};

/**
 * Thing as collection
 * @param thing
 * @param cback
 * @returns {Boolean}
 */
function cEach(thing, cback) {
	this.ret = false;
	this.run = true;
	if (thing == undefined) {
		console.error('Cannot iterate over null thing');
		return false;
	}
	if (!cback || typeof cback != 'function') {
		console.error('No callback assigned to cEeach');
		return false;
	}
	if (thing instanceof Array) {
		for ( var i = 0; i < thing.length; i++) {
			if (!this.run) {
				break;
			}
			cback.call(this, i, thing[i]);
		}
	} else if (thing instanceof Object) {
		console.log('Each array');
		for (elm in thing) {
			if (!this.run) {
				break;
			}
			if (!thing.hasOwnProperty(elm)) {
				continue;
			}
			cback.call(this, elm, thing[elm]);
		}
	} else {
		this.exception('invalid_thing');
	}
	return this.ret;
};

cEach.prototype.stop = function(ret) {
	console.log('stop', ret);
	this.run = false;
	this.ret = ret;
};
/**
 * Encapsulate enum
 * @param options
 * @returns
 */
function Cenum(options) {
	for (o in options) {
		this[o] = options[o];
	}
};

Cenum.prototype.key_by_value = function(value) {
	for(label in this) {
		if (!this.hasOwnProperty(label)) {
			continue;
		}
		if (this[label] == value) return label;
	}
	console.error('No enum found with value', value);
	return '';
};
