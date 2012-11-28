/**
 * @constructor
 * This is our base class, majority of our object inherits method from it.
 * - uid for all objects
 * - send/bind trigger
 * - generic methods
 *  
 * @param {Hash} options Hash encapsulating our object property
 * @param {Array} permitted Array of options that we must parse
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
 * Called each time a new object is created
 * @private
 * @param options
 * @param permitted
 * @returns {Cobject}
 */

Cobject.prototype._class_init = function(options, permitted) {
	this.uid = cUid.get();
	this.callback = {};
	if (SHOJS_DEBUG > 10) console.log('UID', this.uid);
	this._parse_options(options, permitted);
	return this;
};

/**
	This is a STUB. When new instance of Cobject or derived class is
	created this method is called.
	@param {Hash} options Hash from constructor
	@param {Array} permitted Array from constructor
 */
Cobject.prototype.init = function(options, permited) {
	return false;
};

/**
 * Throwing exception with a given label and using this.className
 * @param {String} label A label that can match a message in our exception
 * @param {Object} additional Additional information that we want to pass 
 */
Cobject.prototype.exception = function(label, additional) {
	var e = new Cexception_message({
		className: this.className,
		label: label,
		additional: additional,
		object: this
	});
	console.error(e.to_s());
	throw e;
};

/**
 * 
 * @deprecated
 */
Cobject.prototype.intercept = function(e) {
	if (!this.is_our_exception(e)) {
		throw e;
	}
};

/**
 * @deprecated
 * Return true if this exception have been created by us
 * @param {Exception} e A
 */
Cobject.prototype.is_our_exception = function(exception) {
	if (exception instanceof Cexception_message) {
		return true;
	}
	return false;
};

/**
 * @private
 * This method is reponsible for parsing option when object is created
 * @param {Hash} options From constructor
 * @param [Array] permiited From constructor
 * @return {Boolean} True if no error, else false
 */
Cobject.prototype._parse_options = function(options, permitted) {
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
 * @param {String} what string that can be append to our global UID
 * @return {String} Global UID
 */
Cobject.prototype.guid = function(what) {
	what = what ? '-' + what : '';
	var s = '' + this.className + '-' + this.uid + what;
	return s.toLowerCase();
};

/**
 * Returning trigger name for a given action
 * @param {String} type A given action ex: update, redraw, menu_select ...
 * @return {String} A string representing our action (Globally unique)
 */
Cobject.prototype.get_trigger_name = function(action) {
	return this.guid(action);
};

/**
 * Trigger event on document for a given action
 * @param {String} action A string representing an action 
 * @param {Blob} additional Additional data that we want to pass
 */
Cobject.prototype.send_trigger = function(action, additional) {
	var name = this.get_trigger_name(action);
	if (SHOJS_DEBUG > 4) console.log('[trigger/send]', name, additional);
	$(document).trigger(name, additional);
};

/**
 * Bind trigger for a given action to 
 * @param {Object} srcobj Source object (make trigger name from it)
 * @param {String} action A given action
 * @param {Function} callback A callback to execute when we trigger this action
 */
Cobject.prototype.bind_trigger = function(srcobj, action, callback) {
	var name = srcobj.get_trigger_name(action);
	if (SHOJS_DEBUG > 4) console.debug('[trigger/bind]', action, this.className,' => ', name);
	$(document).bind(name, function(event, data) {
		callback.call(this, event, data);
	});
};

/**
 * Add Cparameter_* to our object
 * @param {Hash} options Our parameter option
 * @return {Boolean} True on success
 */
Cobject.prototype.add_parameter = function(options) {
	if (!('parent' in options)) {
		options.parent = this;
	}
	if (!('label' in options)) {
		this.exception('parameter_need_label', options);
	}
	if (!('type' in options) || options.type == Eparameter_type.numeric) {
		this.parameters[options.label] = new Cparameter_numeric(options);
	} else if (options.type == Eparameter_type.select) {
		this.parameters[options.label] = new Cparameter_select(options);
	} else {
		this.exception('unknow_parameter_type');
	}
	return true;
};


/**
 * Get a parameter value
 * @param {String} key Parameter name
 * @return {Blob} Parameter value
 */
Cobject.prototype.get_parameter = function(key) {
	if (!('parameters' in this) || !(key in this.parameters)) {
		this.exception('accessing_unknow_parameter', key);
	}
	return this.parameters[key].get();
};

/**
 * Return true if a callback exists with a given name
 */
Cobject.prototype.callback_exists = function(name) {
	if (name in this.callback && typeof this.callback[name] == 'function') {
		return true;
	}
	return false;
};
/**
 * Retrieve DOM element for this object
 * If noHeader is false we are encompassing our result into <div />
 * force option force dom_get to rebuild DOM element
 * @param {Hash} options Options {noHeader: true/false, force: true/false}
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
