(function($Graphit) {
	'use strict';
	window.graphit = window['graphit'];
	var getBird = window.graphit['getBird'];
	console.log('getBird');
	var Cuid = getBird('Cuid');
	var Cexception_message = getBird('Cexception_message');
	var Cparameter_select  = getBird('Cparameter_select');
	var Cparameter  = getBird('Cparameter');
	/**
	 * @constructor This is our base class, majority of our object inherits
	 *              method from it. - uid for all objects - send/bind trigger -
	 *              generic methods
	 * @param {Hash}
	 *            options Hash encapsulating our object property
	 * @param {Array}
	 *            permitted Array of options that we must parse
	 */
	var Cobject = function(options, permitted) {
		this.className = 'Cobject';
		this.uid = null;
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
		} catch (e) {
			console.error('Cannot init object << ', this, ' >> Exception <<< ',
					e, ' >>>');
			throw (e);
		}
	};
	
	/**
	 * Method dom_get
	 * Graphit[js/lib/Cobject.js]
	 * sho / 12 déc. 2012 / 14:47:26
	 * @param dumbopt {String} dumbstring
	 */
//	Cobject.prototype.dom_get = function(dumbopt){};
//	Cobject.prototype['dom_get'] = Cobject.prototype.dom_get;
//	
	/**
	 * Called each time a new object is created
	 * 
	 * @private
	 * @param options
	 * @param permitted
	 * @returns {Cobject}
	 */

	Cobject.prototype._class_init = function(options, permitted) {
		var gen = new Cuid();
		this.uid = gen.get();
		console.log('Cuid', this.uid);
		this.callback = {};
		if (window.graphit.debug > 10) console.log('UID', this.uid);
		this._parse_options(options, permitted);
		return this;
	};
	Cobject.prototype['_class_init'] = Cobject.prototype._class_init;

	/**
	 * This is a STUB. When new instance of Cobject or derived class is created
	 * this method is called.
	 * 
	 * @param options
	 *            {Hash} options Hash from constructor
	 * @param permitted
	 *            {Array} permitted Array from constructor
	 */
	Cobject.prototype.init = function(options, permitted) {
		return false;
	};
	Cobject.prototype['init'] = Cobject.prototype.init;

	/**
	 * Throwing exception with a given label and using this.className
	 * 
	 * @param {String}
	 *            label A label that can match a message in our exception
	 * @param {Object}
	 *            additional Additional information that we want to pass
	 */
	Cobject.prototype.exception = function(label, additional, options) {
		var e = new Cexception_message({
			className : this.className,
			label : label,
			additional : additional,
			object : this
		});
		console.error(e.to_s());
		console.log('Options', options);
		if (options && 'dialog' in options && options.dialog) {
			widget_exception(e);
		}
		throw e;
	};
	Cobject.prototype['exception'] = Cobject.prototype.exception;

	//
	// /**
	// * @deprecated
	// * Return true if this exception have been created by us
	// * @param {Exception} e A
	// */
	// Cobject.prototype.is_our_exception = function(exception) {
	// if (exception instanceof Cexception_message) {
	// return true;
	// }
	// return false;
	// };

	/**
	 * @private This method is reponsible for parsing option when object is
	 *          created
	 * @param options
	 *            {Hash} hash from constructor
	 * @param permitted
	 *            {Array} array from constructor
	 * @return {Boolean} True if no error, else false
	 */
	Cobject.prototype._parse_options = function(options, permitted) {
		console.log('Parsing option', options, permitted);
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
		console.log('plop', permitted);
		for ( var i = 0; i < permitted.length; i++) {
			var label = permitted[i];
			console.log('Setting property', label, options[label]);
			if (label in options) {
				this[label] = options[label];
			} else {
				if (window.graphit.debug > 0) console.warn(
						'Needed property <<', label, '>> ');
			}
		}
		this._permitted_keys = permitted;
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
				console
						.error('Callback', m[1],
								'already installed skipping...');
			} else {
				this.callback[m[1]] = options[label];
			}
		}
		return true;
	};
	Cobject.prototype['_parse_options'] = Cobject.prototype._parse_options;

	/**
	 *
	 */
	Cobject.prototype.install_callback = function(opt) {
		if (!opt || !('name' in opt) || !('callback' in opt)
				|| (typeof opt.callback != 'function')) {
			this.exception('install_callback_bad_arguments', opt);
		}
		if (opt.name in this.callback) {
			this.exception('install_callback_already_registered', opt);
		}
		this.callback[opt.name] = opt.callback;
	};
	Cobject.prototype['install_callback'] = Cobject.prototype.install_callback;

	/**
	 * Get Unique Identifier
	 * 
	 * @param {String}
	 *            what string that can be append to our global UID
	 * @return {String} Global UID
	 */
	Cobject.prototype.guid = function(what) {
		what = what ? '-' + what : '';
		var s = '' + this.className + '-' + this.uid + what;
		return s.toLowerCase();
	};
	Cobject.prototype['guid'] = Cobject.prototype.guid;

	/**
	 * Returning trigger name for a given action
	 * 
	 * @param action
	 *            {String} A given action ex: update, redraw, menu_select ...
	 * @return {String} A string representing our action (Globally unique)
	 */
	Cobject.prototype.get_trigger_name = function(action) {
		return this.guid(action);
	};
	Cobject.prototype['get_trigger_name'] = Cobject.prototype.get_trigger_name;

	/**
	 * Trigger event on document for a given action
	 * 
	 * @param {String}
	 *            action A string representing an action
	 * @param {Blob}
	 *            additional Additional data that we want to pass
	 */
	Cobject.prototype.send_trigger = function(action, additional) {
		var name = this.get_trigger_name(action);
		if (window.graphit.debug > 4) console.log('[trigger/send]', name,
				additional);
		$(document).trigger(name, additional);
	};
	Cobject.prototype['send_trigger'] = Cobject.prototype.send_trigger;

	/**
	 *
	 */
	Cobject.prototype.set = function(key, value) {
		throw ('Not_implemented');
	};
	Cobject.prototype['set'] = Cobject.prototype.set;

	/**
	 * Bind trigger for a given action to
	 * 
	 * @param {Object}
	 *            srcobj Source object (make trigger name from it)
	 * @param {String}
	 *            action A given action
	 * @param {Function}
	 *            callback A callback to execute when we trigger this action
	 */
	Cobject.prototype.bind_trigger = function(srcobj, action, callback) {
		if (!srcobj) {
			console.warn('Cannot bind to null object');
			return false;
		}
		var name = srcobj.get_trigger_name(action);
		if (window.graphit.debug > 4) console.debug('[trigger/bind]', action,
				this.className, ' => ', name);
		$(document).bind(name, function(event, data) {
			callback.call(this, event, data);
		});
		return true;
	};
	Cobject.prototype['bind_trigger'] = Cobject.prototype.bind_trigger;

	/**
	 * Add Cparameter_* to our object
	 * 
	 * @param {Hash}
	 *            options Our parameter option
	 * @return {Boolean} True on success
	 */
	Cobject.prototype.add_parameter = function(options) {
		console.log('Add parameter', options);
		var iParam = new Cparameter();
		if (!('parent' in options)) {
			options.parent = this;
		}
		if (!('label' in options)) {
			this.exception('parameter_need_label', options);
		}
		if (!('type' in options) || options.type == Eparameter_type.numeric) {
			this.parameters[options.label] = new Cparameter_numeric(options);
		} else if (options.type == Cparameter_select['Etype'].select) {
			this.parameters[options.label] = new Cparameter_select(options);
		} else {
			this.exception('unknow_parameter_type');
		}
		return true;
	};
	Cobject.prototype['add_parameter'] = Cobject.prototype.add_parameter;

	/**
	 * Get a parameter value
	 * 
	 * @param {String}
	 *            key Parameter name
	 * @return {Blob} Parameter value
	 */
	Cobject.prototype.get_parameter = function(key) {
		if (!('parameters' in this) || !(key in this.parameters)) {
			this.exception('accessing_unknow_parameter', key);
		}
		return this.parameters[key].get();
	};
	Cobject.prototype['get_parameter'] = Cobject.prototype.get_parameter;

	/**
	 * Return true if a callback exists with a given name
	 */
	Cobject.prototype.callback_exists = function(name) {
		if (name in this.callback && typeof this.callback[name] == 'function') {
			return this.callback[name];
		}
		return null;
	};
	Cobject.prototype['callback_exists'] = Cobject.prototype.callback_exists;

	/**
	 * Retrieve DOM element for this object If noHeader is false we are
	 * encompassing our result into <div /> force option force dom_get to
	 * rebuild DOM element
	 * 
	 * @param {Hash}
	 *            options Options {noHeader: true/false, force: true/false}
	 * @return {JQueryObject} DOM Element for this object
	 */
	Cobject.prototype.dom_get = function(options) {
		options = options || {};
		options['force'] = false;
		var rootElm = this['rootElm'];
		if (options['force'] || !rootElm) {
			rootElm = this.dom_build()['rootElm'];
		}
		if ('noHeader' in options && options['noHeader']) {
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
	Cobject.prototype['dom_get'] = Cobject.prototype.dom_get;

	/**
	 *
	 */
	Cobject.prototype.add_widget = function(name, rootElm) {
		if (!name || !rootElm) {
			this.exception('no_name_or_root_elm', {
				name : name,
				rootElm : rootElm
			});
		}
		if (!('widgets' in this)) {
			this.widgets = {};
		}
		if (name in this.widgets) {
			this.exception('dialog_already_exist', name);
		}
		this.widgets[name] = rootElm;
		return this;
	};
	Cobject.prototype['add_widget'] = Cobject.prototype.add_widget;

	/**
	 * Method to_s
	 */
	Cobject.prototype.to_s = function(nl) {
		var nl = nl || "\n";
		var str = '[' + this.className + ']' + nl;
		str += ' - uid: ' + this.uid + nl;
		str += ' - trigger name: ' + this.get_trigger_name() + nl;
		return str;
	};
	Cobject.prototype['to_s'] = Cobject.prototype.to_s;

	/**
	 *
	 */
	Cobject.prototype.get_widget = function(name) {
		if (!name || !(name in this.widgets)) {
			this.exception('no_widget_with_this_name', {
				name : name
			});
		}
		return this.widgets[name];
	};
	Cobject.prototype['get_widget'] = Cobject.prototype.get_widget;

	/**
	 * Method _test
	 */
	Cobject.prototype.__test = function(opt) {
		var Cobject = getBird('Cobject');
		var o = new Cobject({
			'parent' : this,
			'label' : 'Test',
			'className' : 'Test'
		});
		console.debug(o.to_s(opt));
		try {
			o.exception('test_exception', "We are throwing a test exception");
		} catch (e) {
			if (e.type != 'shojs-exception') {
				throw e;
			}
			console.error('Exception', e, e.to_s(opt));
			return false;
		}
		return true;
	};
	Cobject.prototype['__test'] = Cobject.prototype.__test;

	// Export
	$Graphit['_class_pool']['Cobject'] = Cobject;
})(graphit);
