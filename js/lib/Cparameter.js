/**
 * 
 * @param obj
 * @returns
 */
function getObjectClass(obj){
	   if (typeof obj != "object" || obj === null) return false;
	   console.log(obj.constructor.toString());
	   var pat = /^function (\w+)\(/;
	   return pat.exec(obj.constructor.toString())[1];
};

/**
 * 
 */
var Eparameter_type = {
	numeric: 1,
	select: 2,
};
/******************************************************************************
 * 
 * @param options
 * @returns
 */
function Cparameter(options) {
    	if (!options) { 
    	    console.warn('Constructor call without options parameter'); 
    	    return null; 
    	}
	this.autosave = true;
	this.parent = options.parent;
	this.type = options.type;
	if (!options.parent) { 
		console.error('Ctool_parameter require parent in options {...}');
		return null;
	}
	if (!options.type) {
	    	options.type = Eparameter_type.numeric;
	}

	this.init(options);
	this.reset();
	return this;
}

Cparameter.prototype._init= function() {
	this.set(this.def);
};
Cparameter.prototype.reset = function() {
	this.set(this.def);
};

Cparameter.prototype.get = function(k) {
	if (!(k in this)) {
		console.error('Invalid key', k);
		return null;
	}
	return this[k];
};




/**
 * 
 * @param options
 * @returns
 */
function Cparameter_numeric(options) {
    if (options.type != undefined && options.type != Eparameter_type.numeric) {
	console.error('Building Cparameter_numeric with bad options');
	return null;
    }
    options.type = Eparameter_type.numeric;
    Cparameter.call(this, options);
    return this;
}

Cparameter_numeric.prototype = Object.create(Cparameter.prototype);
Cparameter_numeric.prototype.constructor = new Cparameter();

Cparameter_numeric.prototype.init = function(options) {
	this.checks = new Object({ label: 1, min: 1, max: 1, def: 1, step: 1,});
	for (k in this.checks) {
		if (!(k in options) || options[k] === undefined) {
			console.error('Missing parameter key/value', options, k);
			return null;
		}
		if (k == 'label') { this[k] = options[k]; }
		else { this[k] = parseFloat(options[k]); }
	}
	if ('callback_onchange' in options && typeof(options.callback_onchange) == 'function') {
		this.callback_onchange = options.callback_onchange;
	};
};

Cparameter.prototype.set = function(v) {
	v = parseFloat(v);
	if (v == this.value) {
		return this;
	}
	if (this.autosave && 'label' in this.parent) {
		var classname = 'global';
		if ('className' in this.parent) { classname = this.parent.className; }
		var label = classname + '-' + this.parent.label + '-' + this.label;
		cRegistry.set(label, v);
	}
	if ('callback_onchange' in this && typeof(this.callback_onchange) == 'function') {
		this.callback_onchange.call(this, v);
	}
	this.value = v;
	return this;
};
/**
 * 
 * @param options
 * @returns
 */
function Cparameter_select(options) {
    if (options.type != Eparameter_type.select) {
	console.error('Building Cparameter_select with bad options');
	return null;
    }
    Cparameter.call(this, options);
    
}

Cparameter_select.prototype = Object.create(Cparameter.prototype);
Cparameter_select.prototype.constructor = new Cparameter();

Cparameter_select.prototype.init = function(options) {
    console.log('Init select');
    this.choices = {};
    this.def = options.def;
    this.label = options.label;
    for (label in options.choices) {
	console.log('option', label);
	this.choices[label] = options.choices[label];
    }
};

Cparameter_select.prototype.set = function(value) {
    console.log('Init select');
    this.value = value;
};