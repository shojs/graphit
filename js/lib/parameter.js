(function(window, graphit, console, undefined) {

	'use strict';

	var modulePath = 'lib/parameter';
	
	var Cobject = graphit.import('lib/object');
	var Clocal_storage = graphit.import('lib/localStorage');
	
	var Etype = graphit.import('lib/parameter/enum/type');
	
	/***************************************************************************
	 * @constructor Class holding parameter Each parameter must have a default
	 *              value (def) Sub class can override _set and _get
	 * @param {Hash}
	 *            options Constructor hash
	 */
	var Module = function(options) {
		options = options || {};
		options['className'] = options['className'] || modulePath;
		options['autoSave'] = ('autoSave' in options && options.autoSave) ? true
				: false;
		options['label'] = options['label'] || 'parameter';
		if ('parameters' in options) {
			this.exception('no_parameter_for_me');
		}
		Cobject.call(this, options, [
				'type', 'def', 'label', 'autoSave', 'parent'
		]);
		if (this.autoSave) {
			this.store = new Clocal_storage();
		}
		this.__post_init(options);
		return this;
	};

	/**
	 * Inheritance
	 */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * Executed after init subclass must not overide this
	 * 
	 * @private
	 * @param {Hash}
	 *            Constructor hash
	 */
	Module.prototype.__post_init = function(options) {
		if (this.autoSave) {
			var label = this.make_registry_key();
			if (window.graphit.debug > 0) console.log('Loading parameter',
					label);
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
		for ( var k in options) {
			var m = exp.exec(k);
			if (!m) {
				continue;
			}
			if (options[k] && typeof options[k] == 'function') {
				if (window.graphit.debug > 10) console.log(
						'Installing callback for parameter[' + this.type + ']',
						k);
				this[k] = options[k];
			}
		}
	};
	
	/**
	 * Set our parameter value We are calling _set before actually setting value
	 * to give sub class a chance to alterate value
	 * 
	 * @param {Object}
	 *            value
	 * @returns {Boolean}
	 */
	Module.prototype.set = function(value) {
		if (this.value == value) {
			return false;
		}
		this['value'] = this._set(value);
		if (this['autoSave']) {
			var label = this.make_registry_key();
			this['store'].set(label, this['value']);
		}
		this.send_trigger('parameter_update');
		return true;
	};
	
	/**
	 * Stub, called before set() on subclass
	 * 
	 * @param {Object}
	 *            value
	 * @return {Object} our modified value
	 */
	Module.prototype._set = function(value) {
		return value;
	};

	/**
	 * Setting parameter value to is default
	 * 
	 * @return Parameter value
	 */
	Module.prototype.reset = function() {
		this.set(this.def);
		return this.get();
	};

	/**
	 * @returns
	 */
	Module.prototype.get = function() {
		return this._get(this.value);
	};
	
	/**
	 * @param value
	 * @returns
	 */
	Module.prototype._get = function(value) {
		return value;
	};
	
	/**
	 * @returns
	 */
	Module.prototype.make_registry_key = function() {
		var classname = this['parent']['className'] || this.className;
		var label = this['parent']['label'];
		if (!classname) this.exception('no_classname_in_parent');
		if (!label) this.exception('no_label_in_parent');
		var key = classname + '-' + label + '-' + this.label;
		return key.toLowerCase();
	};
	
	/**
	 * Method to_s Graphit[js/lib/parameters/Module.js] sho / 12 déc. 2012 /
	 * 12:57:51
	 * 
	 * @param opt
	 *            {Hash} Hash options
	 */
	Module.prototype.to_s = function(opt) {
		opt = opt || {};
		nl = opt.nl || "\n";
		var str = '[' + this['className'] + ']' + nl;
		str += ' - label: ' + this['label'] + nl;
		return str;
	};
	
	/**
	 * Method __test Graphit[js/lib/parameters/Module.js] sho / 12 déc. 2012 /
	 * 12:16:23
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Module.prototype.__test = function() {
		var M = graphit.import(modulePath);
		var keyTest = '__TEST__';
		var parent = {
				className: 'classTest',
				label: 'labelTest'
		};
		var m = new M({
			'autoSave' : true,
			'parent' : parent,
			'def' : 'Test',
			'type' : Etype.numeric,
		});
		m.set(keyTest, keyTest);
		return true;
	};
	
	// Export
	graphit.export(modulePath, Module);

})(window, graphit, console, undefined);
