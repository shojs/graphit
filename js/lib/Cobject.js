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
	cUid = new Cuid();
	if (options == undefined) {
		return;
	}
	if (!(options instanceof Object)) {		
		var msg = "[Cobject/Constructor] Options must be hash aka Object";
		console.error(msg, this);
		throw msg;
	}
	this.parent = null;
	this.parameters = {};
	this._class_init(options, permitted);
	try {
		this.init(options, permitted);
	} catch(e) {
		this.intercept(e);
		console.error('Cannot init object << ', this, ' >> Exception <<< ', e , ' >>>');
		throw(e);
	}
}

/**
 * Class initialization
 * @param options
 * @param permitted
 * @returns {Cobject}
 */

Cobject.prototype._class_init = function(options, permitted) {
	this.uid = cUid.get();
	this.callback = {};
	if (SHOJS_DEBUG > 10) console.log('UID', this.uid);
	this.parse_options(options, permitted);
	return this;
};

/**
 * INIT STUB 
 */
Cobject.prototype.init = function() {
	//console.warn(this.className, 'Method init() need to be overidden in sub class');
	return false;
};

/**
 * Throwing exception with a given label and using this.className
 */
Cobject.prototype.exception = function(label, msg) {
	throw new Cexception_message({
		className: this.className,
		label: label,
		additional: msg,
		object: this,
	});
};

/**
 *
 */
Cobject.prototype.intercept = function(e) {
	if (!this.is_our_exception(e)) {
		throw e;
	}
};
/**
 *
 */
Cobject.prototype.is_our_exception = function(e) {
	if (!('type' in e) || e.type != 'shojs-exception') {
		return false;
	}
	return true;
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
	var mandatory = [
			'className', 'label'
	];
	for ( var i = 0; i < mandatory.length; i++) {
		if (!(mandatory[i] in options) && !options[mandatory[i]]) {
			this.exception('missing_mandatory_parameter', mandatory[i]);
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
				if (SHOJS_DEBUG > 10) console.warn('Needed property <<', label,
						'>> ');
			}
		}
	}
	if ('parameters' in options) {
		for (plabel in options.parameters) {
			this.add_parameter(options.parameters[plabel]);
		}
	}
	var pat = /^callback_(.*)$/;
	for ( var label in options) {
		var m = pat.exec(label);
		if (!m) {

		} else if (m[1] in this.callback) {
			console.error('Callback', m[1], 'already installed skipping...');
		} else {
			this.callback[m[1]] = options[label];
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
Cobject.prototype.guid = function(what) {
	what = what ? '-' + what : '';
	var s = '' + this.className + '-' + this.uid + what;
	return s.toLowerCase();
};

/**
 * Returning trigger name for a given action
 * @param type
 * @returns
 */
Cobject.prototype.get_trigger_name = function(type) {
	return this.guid(type);
};

/**
 * Trigger event of type for this object
 * @param type
 * @param d
 */
Cobject.prototype.send_trigger = function(type, d) {
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
	if (SHOJS_DEBUG > 4) console.debug('[trigger/bind]', this.className,
			' => ', name);
	$(document).bind(name, function(e, d) {
		callback.call(this, e, d);
	});
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
	} else if (options.type == Eparameter_type.select) {
		this.parameters[options.label] = new Cparameter_select(options);
	} else {
		console.error('Unknown parameter type', options);
	}
	return true;
};

/**
 * Get parameter by key
 * @param key
 * @return {value} Value of given key
 */
Cobject.prototype.get_parameter = function(key) {
	console.log(this);
	if (!('parameters' in this) || !(key in this.parameters)) {
		this.exception('accessing_unknow_parameter', key);
	}
	return this.parameters[key].get();
};

/**
 * Retrieve dom element of this object
 * @param force
 * @returns
 */
Cobject.prototype.dom_get = function(options) {
	options = options || {};
	options.force = false;
	var rootElm = this.rootElm;
	if (options.force || !rootElm) {
		rootElm = this.dom_build().rootElm;
	}
	if ('noHeader' in options && options.noHeader) {
		return rootElm;
	}
	var r = $('<div />');
	r.attr('id', this.uid);
	r.attr('title', this.label);
	var classname = this.className + '-' + this.label;
	r.addClass(classname.toLowerCase());
	r.append(rootElm);
	return r;
};
