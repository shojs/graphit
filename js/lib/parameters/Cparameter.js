/**
 * 
 */
var Eparameter_type = {
	numeric : 1,
	select : 2,
	checkbox : 3
};

/******************************************************************************
 * Class holding parameter
 * Each parameter must have a default value (def)
 * Sub class can override _set and _get
 * @param {Hash} options Constructor hash
 */
function Cparameter(options) {
	options = options || {};
	options.className = options.className || 'Cparameter';
	options.autoSave = ('autoSave' in options && options.autoSave)? true: false;
	options.label = options.label || 'parameter';
	if ('parameters' in options) {
		this.exception('no_parameter_for_me');
	}
	Cobject.call(this, options, ['parent', 'type', 'def', 'label', 'autoSave']);
	
	if (this.autoSave) {
		this.store = new Clocal_storage();
	}
	if (!options.parent && this.className != 'Cparameter') {
		this.exception('mandatory_argument_missing', 'parent');
		return null;
	}
	this.__post_init(options);
	return this;
}

/* Inheritance */
Cparameter.prototype = Object.create(Cobject.prototype);
Cparameter.prototype.constructor = new Cobject();

/*
 * Executed after init subclass must not overide this
 * @private
 * @param {Hash} Constructor hash
 */
Cparameter.prototype.__post_init = function(options) {
	if (this.autoSave) {
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

/**
 * Set our parameter value
 * We are calling _set before actually setting value to give sub class
 * a chance to alterate value
 * @param {Object} value
 * @returns {Boolean}
 */
Cparameter.prototype.set = function(value) {
	if (this.value == value) {
		return false;
	}
	this.value = this._set(value);
	if (this.autoSave) {
		var label = this.make_registry_key();
		this.store.set(label, this.value);
	}
	this.send_trigger('update');
	return true;
};

/**
 * Stub, called before set() on subclass
 * @param {Object} value 
 * @return {Object} our modified value
 */
Cparameter.prototype._set = function(value) {
	return value;
};

/**
 * Setting parameter value to is default
 * @return Parameter value
 */
Cparameter.prototype.reset = function() {
	this.set(this.def);
	return this.get();
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


Cparameter.prototype.make_registry_key = function() {
	var classname = this.parent.className;
	var label = this.parent.label;
	if (!classname) this.exception('no_classname_in_parent');
	if (!label) this.exception('no_label_in_parent');
	var key = classname + '-' + label + '-' + this.label;
	return key.toLowerCase();
};
