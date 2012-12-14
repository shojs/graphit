var E_LAYERLABEL = new Object({
	current : '_current',
	mouse : '_mouse',
	grid : '_gris',
	prefrag : '_prefrag'
});

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
window['isCanvasSupported'] = isCanvasSupported;

function isFileSupported() {
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		return true;
	}
	console.error('The File APIs are not fully supported in this browser.');
	return false;
}

function getLanguage() {
	var lang = (navigator.language) ? navigator.language
			: navigator.userLanguage;
	var pat = /^\s*([^-]*)-([^\s]*)\s*$/;
	var match = pat.exec(lang);
	if (match) {
		return match[1];
	}
	return lang;
}
window['getLanguage'] = getLanguage;

/**
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
 * @constructor
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
 * @constructor
 * Encapsulate enum
 * 
 * @param options
 * @returns
 */
function Cenum(options) {
	for (o in options) {
		this[o] = options[o];
	}
};

Cenum.prototype.key_by_value = function(value) {
	for (label in this) {
		if (!this.hasOwnProperty(label)) {
			continue;
		}
		if (this[label] == value) return label;
	}
	console.error('No enum found with value', value);
	return '';
};

/**
 * Little helper for popin windows
 * @constructor
 * @param dom
 * @param options
 * @returns
 */
function widget_factory(dom, options) {
	options = options || {};
	if (!dom) {
		throw ('func_widget_factory_need_dom');
	}
	console.log('Widget factory', dom, options);
	var mandatory = {
		'autoOpen' : true,
		'resizable' : true,
		'draggable' : true,
		'width' : 250,
		'zIndex' : 10,
		'dialogClass' : 'shojs-dialog',
		'stack' : true
	};
	for ( var label in mandatory) {
		if (!(label in options)) {
			options[label] = mandatory[label];
		}
	}
	dom['dialog'](options);
	return dom;
};
window['widget_factory'] = window.widget_factory;
/**
 * 
 * @param e
 * @returns
 */
function widget_exception(e) {
	var Cexception_message = graphit.import('lib/exception');
	console.error('Widget', e);
	var msg = e;
	var title = '[Error] ';
	if (e instanceof Cexception_message) {
		msg = e.to_s({
			format : 'html'
		});
		title = title + e.className + '/' + e.label;
	}
	var r = $('<div title="' + title + '" />');
	r.append($('<p>' + msg + '<p/>'));
	r.dialog({
		modal : true
	});
	throw e;
}
window['widget_exception'] = window.widget_exception;


/**
 * 
 * @param docTarget
 */
function deleteAllCookies(docTarget) {
	docTarget = docTarget || window.document;
	var cookies = docTarget.cookie.split(";");
	for ( var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		console.log('Delete cookie', cookie);
		var eqPos = cookie.indexOf("=");
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		docTarget.cookie = name
				+ "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	}
	var opener = window.opener;
	if (opener) {
		deleteAllCookies(opener.document);
	}
}
