/**
 * Our base class
 * - uid for all objects
 * - send/bind trigger
 * - generic methods
 *  
 * @param options
 * @param permitted
 */
function Cobject(options, permitted) {
    	if (options == undefined) {
    	    return;
    	}
	this.parent = null;
	this.parameters = {};
	this._class_init(options, permitted);
	this.init();
}

/**
 * Class initialization
 * @param options
 * @param permitted
 * @returns {Cobject}
 */
Cobject.prototype._class_init = function(options, permitted) {
	this.uid = UID.get();
	if (SHOJS_DEBUG > 10) console.log('UID', this.uid);
	this.parse_options(options, permitted);
	return this;
};

/**
 * Parsing options
 * @param options
 * @param permitted
 * @returns {Boolean}
 */
Cobject.prototype.parse_options = function(options, permitted) {
    	if (options == undefined) {
    	    console.warn("No << {} >> argument passed to new Cobject");
    	    return;
    	}
    	permitted = permitted || [];
    	var mandatory = ['className', 'label'];
    	for (var i = 0; i < mandatory.length; i++) {
    	    if (!( mandatory[i] in options) && !options[mandatory[i]]){
    		console.error('Missing ' + mandatory[i] +' in Cobject parameters');
    		return false;
    	    } else {
    		permitted.push(mandatory[i]);
    	    }
	
    	}
	if (permitted && typeof permitted === 'object') {
		for ( var i = 0; i < permitted.length; i++) {
			var label = permitted[i];
			if (label in options) {
				this[label] = options[label];
			} else {
			    if (SHOJS_DEBUG > 10) console.warn('Needed property <<', label, '>> ');
			}
		}
	}
	if ('parameters' in options) {
		for (plabel in options.parameters) {
			this.add_parameter(options.parameters[plabel]);
		}
	}
	return true;
};
/**
 * Get Unique Identifier
 * @param type
 * @param what
 * @returns <String>
 */
Cobject.prototype.guid = function(type, what) {
    what = what? '-' + what: '';
    var s = '' + this.className + '-' + this.uid + what;
    return s.toLowerCase();
};

/**
 * Returning trigger name for a given action
 * @param type
 * @returns
 */
Cobject.prototype.get_trigger_name = function(type) {
    return this.guid('trigger', type);
};

/**
 * Trigger event of type for this object
 * @param type
 * @param d
 */
Cobject.prototype.send_trigger = function (type, d) {
    var n = this.get_trigger_name(type);
    if (SHOJS_DEBUG > 4) console.log('[trigger/send]', n);
    $(document).trigger(n, d);
};

/**
 * Binding trigger to this object
 * @param osrc
 * @param type
 * @param callback
 */
Cobject.prototype.bind_trigger = function(osrc, type, callback) {
    var name = osrc.get_trigger_name(type);
    if (SHOJS_DEBUG > 4) console.debug('[trigger/bind]', this.className, ' => ', name);
    $(document).bind(name, function(e, d) { callback.call(this, e, d); } );
};

/**
 * Adding parameters
 * Cparameter is a class to hold value (clamp, default, autoSave...)
 * @param options
 * @returns {Boolean}
 */
Cobject.prototype.add_parameter = function(options) {
	if (!('parent' in options)) {
		options.parent = this;
	}
	if (!('label' in options)) {
		console.error('Parameters need label');
		return false;
	}
	if (!('type' in options) || options.type == Eparameter_type.numeric) {
	    this.parameters[options.label] = new Cparameter_numeric(options);
	} else if(options.type == Eparameter_type.select) {
	    this.parameters[options.label] = new Cparameter_select(options);
	} else {
	    console.error('Unknown parameter type', options);
	}
	return true;
};

/**
 * Get parameter by key
 * @param key
 * @returns
 */
Cobject.prototype.get_parameter = function(key) {
	if (!('parameters' in this) || !(key in this.parameters)) {
		console.error('Invalid parameter <<', key, '>>', this);
		return null;
	}
	return this.parameters[key].value;
};
/**
 * STUB
 */
Cobject.prototype.init = function() {
	;
};

/**
 * Retrieve dom element of this object
 * @param force
 * @returns
 */
Cobject.prototype.dom_get = function(force) {
	if (this.rootElm && !force) {
		return this.rootElm;
	}
	return this.dom_build().rootElm;
};