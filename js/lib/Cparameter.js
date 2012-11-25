/**
 * 
 */
var Eparameter_type = {
	numeric : 1,
	select : 2,
	checkbox : 3
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
	this.bAutosave = ('bAutosave' in options ? options.bAutosave : true);
	if (this.bAutosave) {
		this.store = new Clocal_storage();
	}
	this.parent = options.parent;
	this.type = options.type;
	this.def = options.def;
	this.label = options.label;

	if (!options.parent) {
		console.error('Ctool_parameter require parent in options {...}');
		return null;
	}
	if (!options.label) {
		console.error('Ctool_parameter require label in options {...}');
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
		var v = this.store.get(label);
		if (v != undefined) {
			this.value = this._set(v);
		} else {
			this.value = this._set(this.def);
		}
	} else {
		this.value = this._set(this.def);
	}
	this.rootElm = null;
	var exp = /^callback_(.*)$/;
	for (k in options) {
		var m = exp.exec(k);
		if (!m) {
			continue;
		}
		if (options[k] && typeof options[k] == 'function') {
			if (SHOJS_DEBUG > 10) console.log(
					'Installing callback for parameter[' + this.type + ']', k);
			this[k] = options[k];
		}
	}
};

Cparameter.prototype.set = function(value) {
	if (this.value == value) {
		return false;
	}
	this.value = this._set(value);
	if (this.bAutosave) {
		var label = this.make_registry_key();
		this.store.set(label, this.value);
	}
	return true;
};

/**
 *
 */
Cparameter.prototype._set = function(value) {
	return value;
};

Cparameter.prototype.reset = function() {
	this.set(this.def);
};

Cparameter.prototype.get = function() {
	return this._get(this.value);
};

Cparameter.prototype._get = function(value) {
	return value;
};

/**
 *
 */
Cparameter.prototype.get = function() {
	return this._get(this.value);
};

Cparameter.prototype.dom_get = function(force) {
	if (this.rootElm && force != undefined && !force) {
		return this.rootElm;
	}
	return this.dom_build().rootElm;
};

Cparameter.prototype.make_registry_key = function() {
	var classname = this.parent.className;
	var label = this.parent.label;
	if (!classname) this.exception('no_classname_in_parent');
	if (!label) this.exception('no_label_in_parent');
	var key = classname + '-' + label + '-' + this.label;
	return key.toLowerCase();
};
