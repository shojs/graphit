/*******************************************************************************
 * 
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

Cobject.prototype._class_init = function(options, permitted) {
	this.uid = UID.get();
	if (SHOJS_DEBUG > 10) console.log('UID', this.uid);
	this.parse_options(options, permitted);
};

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
				console.warn('Needed property <<', label, '>> ');
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

Cobject.prototype.getContext = function(type) {
    type = type || '2d';
    if ('cCanvas' in this) {
	return this.cCanvas.data.getContext(type);
    }
    console.error('Cannot return context for this object... no cCanvas');
    return null;
};

Cobject.prototype.get_trigger_name = function(type) {
    var n = 'shojs-' + this.className + '-' + this.label + '-' + type;
    n = n.toLowerCase();
    return n;
};

Cobject.prototype.send_trigger = function (type, d) {
    var n = this.get_trigger_name(type);
    console.log('[trigger/send]', n);
    $(document).trigger(n, d);
};

Cobject.prototype.bind_trigger = function(osrc, type, callback) {
    var name = osrc.get_trigger_name(type);
    console.debug('[trigger/bind]', this.className, ' => ', name);
    $(document).bind(name, function(e, d) { callback.call(this, e, d); } );
};

Cobject.prototype.add_parameter = function(options) {
	if (!('parent' in options)) {
		options.parent = this;
	}
	if (!('label' in options)) {
		console.error('Parameters need label');
		return false;
	}
	//console.log('param type', options.type);
	if (!('type' in options) || options.type == Eparameter_type.numeric) {
	    this.parameters[options.label] = new Cparameter_numeric(options);
	} else if(options.type == Eparameter_type.select) {
	    this.parameters[options.label] = new Cparameter_select(options);
	} else {
	    console.error('Unknown parameter type', options);
	}
	return true;
};

Cobject.prototype.get_parameter = function(key) {
	if (!('parameters' in this) || !(key in this.parameters)) {
		console.error('Invalid parameter <<', key, '>>', this);
		return null;
	}
	return this.parameters[key].value;
};

Cobject.prototype.callback_exists = function(name) {
	var label = 'callback_' + name;
	if (!(label in this) || (typeof this[label] != 'function')) {
		return null;
	}
	return this[label];
};

Cobject.prototype.callback_get = function(name) {
	var clabel = 'callback_' + name;
	if (!this.callback_exists(clabel)) {
		return null;
	}
	return this.options[clabel];
};

Cobject.prototype.callback_execute = function(name, params) {
	var clabel = 'callback_' + name;
	if (this.callback_exists(clabel)) {
		console.error('No callback named ' + clabel);
	}
};

Cobject.prototype.init = function() {
	;
};

Cobject.prototype.dom_get = function(force) {
	if (this.rootElm && !force) {
		return this.rootElm;
	}
	return this.dom_build().rootElm;
};