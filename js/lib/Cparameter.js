
/**
 * 
 */
var Eparameter_type = {
	numeric: 1,
	select: 2,
	checkbox: 3,
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
	this.bAutosave = true;
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
	//this.reset();
	this._init(options);
	return this;
}

Cparameter.prototype._init = function(options) {
    	if (this.bAutosave) {
    	    var label = this.make_registry_key();
    	    var v = cRegistry.get(label);
    	    if (v != undefined) {
    		this._set(v);
    	    } else { this._set(this.def);}
    	} else {
    	    this._set(this.def);
    	}
    	this.rootElm = null;
        if (options && 'callback_change' in options && typeof options.callback_change == 'function') {
    		this.callback_change = options.callback_change;
        }
};

Cparameter.prototype.set = function(value) {
    	if (this.value == value) {
    	    return false;
    	}
	this._set(value);
	if (this.bAutosave) {
	    var label = this.make_registry_key();
	    //console.log('Saving key', label, this.value)
	    cRegistry.set(label, this.value);
	}
	return true;
};

Cparameter.prototype.reset = function() {
	this.set(this.def);
};

Cparameter.prototype.get = function(k) {
	if (!(k in this)) {
		console.error('Invalid key', k);
		return null;
	}
	if (this.bAutosave) {
	    var label = this.make_registry_key();
	    return this._get(cRegistry.get(label));
	}
	return this._get(this[k]);
};

Cparameter.prototype._get = function(value) {
    return value;
};

Cparameter.prototype.dom_get = function(force) {
    if (this.rootElm && force != undefined && !force) {
	return this.rootElm;
    }
    return this.dom_build().rootElm;
};

Cparameter.prototype.make_registry_key = function() {
    	//console.log('MAKE', this.parent);
	var classname = this.parent.className || 'global';
	var label = this.parent.label || 'test';
	var key = classname + '-' + label + '-' + this.label;
	//console.log('key: ', key);
	return key.toLowerCase();
};


/**
 * 
 * @param options
 * @returns
 */
function Cparameter_numeric(options) {
    options.type = Eparameter_type.numeric
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

Cparameter.prototype._get = function(v) {
    return parseFloat(v);
};

Cparameter.prototype._set = function(v) {
	v = parseFloat(v);
	this.value = v;
};
/**
 * 
 * @param options
 * @returns
 */
function Cparameter_select(options) {
    options.type = Eparameter_type.select;
    Cparameter.call(this, options);
    
}

Cparameter_select.prototype = Object.create(Cparameter.prototype);
Cparameter_select.prototype.constructor = new Cparameter();

Cparameter_select.prototype.init = function(options) {
    //console.log('Init select');
    this.choices = {};
    this.def = options.def;
    this.label = options.label;
    for (label in options.choices) {
	this.choices[label] = options.choices[label];
    }

};

Cparameter_select.prototype._set = function(value) {
    this.value = value;
};

Cparameter_select.prototype.dom_build = function() {
    var that = this;
    var r = $(document.createElement('div'));
    r.addClass('selectex parameter');
    r.append('<h6>' + this.label + '</h6>');
    var s = $('<select />');
    for (c in this.choices) {
	// console.log('choice', param.choices[c]);
	var o = $('<option/>');
	o.attr('value', this.choices[c]);
	if (this.value == c) {
	    o.attr('selected', 'selected');
	}
	o.append(document.createTextNode(this.choices[c]));
	s.append(o);
    }
    s.change(function() {
	that.set(this.value);
	if ('callback_change' in that) {
	    that.callback_change.call(that, this.value);
	}

    });
    r.append(s);
    this.rootElm = r;
    return this;
}
/**
 * 
 * @param options
 * @returns
 */
function Cparameter_checkbox(options) {
    options.type = Eparameter_type.checkbox;
    Cparameter.call(this, options);
}

Cparameter_checkbox.prototype = Object.create(Cparameter.prototype);
Cparameter_checkbox.prototype.constructor = new Cparameter();

Cparameter_checkbox.prototype.init = function(options) {
    //console.log('Init select');
    this.choices = {};
    this.def = options.def;
    this.label = options.label;
};

Cparameter_checkbox.prototype._get = function(value) {
    if (value == 'true') this.value = true;
    else if (value == 'false') this.value = false;
    else if (value) this.value = true;
    else this.value = false;
};

Cparameter_checkbox.prototype._set = function(v) {
	if (v) {
	    this.value = true;
	} else {
	    this.value = false;
	}
};
