/**
 * 
 */
var Eparameter_type = {
	numeric: 1,
	select: 2,
	checkbox: 3
};
/******************************************************************************
 * 
 * @param options
 */
function Cparameter(options) {
    	if (!options) { 
    	    //console.warn('Constructor call without options parameter'); 
    	    return null; 
    	}
	this.bAutosave = true;
	this.parent = options.parent;
	this.type = options.type;
	this.def = options.def;
	this.label = options.label;
	if (!options.parent) { 
		console.error('Ctool_parameter require parent in options {...}');
		return null;
	}
	if (!options.type) {
	    	options.type = Eparameter_type.numeric;
	}
	this.init(options);
	this._init(options);
	return this;
}

Cparameter.prototype._init = function(options) {
    	if (this.bAutosave) {
    	    var label = this.make_registry_key();
    	    if (SHOJS_DEBUG > 10) console.log('Loading parameter', label);
    	    var v = cRegistry.get(label);
    	    if (v != undefined) {
    		this._set(v);
    	    } else {
    		this._set(this.def);}
    	} else {
    	    this._set(this.def);
    	}
    	this.rootElm = null;
    	var exp = /^callback_(.*)$/;
    	for (k in options) {
    	    var m = exp.exec(k);
    	    if (!m) { continue; }
    	    if (options[k] && typeof options[k] == 'function') {
    		if (SHOJS_DEBUG > 10) console.log('Installing callback for parameter[' + this.type + ']', k);
    		this[k] = options[k];
    	    }
        }
};

Cparameter.prototype.set = function(value) {
    	if (this.value == value) {
    	    return false;
    	}
	this._set(value);
	if (this.bAutosave) {
	    var label = this.make_registry_key();
	    cRegistry.set(label, this.value);
	}
	return true;
};

Cparameter.prototype.reset = function() {
	this.set(this.def);
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
    	if (!this.parent.className) console.log('parent', this.parent);
    	if (!this.parent.label) console.log('parent', this.parent);
	var classname = this.parent.className || 'global';
	var label = this.parent.label || 'test';
	var key = classname + '-' + label + '-' + this.label;
	return key.toLowerCase();
};


