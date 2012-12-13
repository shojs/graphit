(function(window, graphit, console, undefined) {
	
	'use strict';
	
	var Cobject = graphit.import('Cobject');
	var Clocal_storage = graphit.import('Clocal_storage');
	
	/***************************************************************************
	 * @constructor Class holding parameter Each parameter must have a default
	 *              value (def) Sub class can override _set and _get
	 * @param {Hash}
	 *            options Constructor hash
	 */
	var Cparameter = function(options) {
		this.Etype = {
				'numeric' : 1,
				'select' : 2,
				'checkbox' : 3
			};
		this['Etype'] = this.Etype;
		console.log('Etype', this.Etype);
		options = options || {};
		options['className'] = options['className'] || 'Cparameter';
		options['autoSave'] = ('autoSave' in options && options.autoSave) ? true
				: false;
		options['label'] = options['label'] || 'parameter';
		if ('parameters' in options) {
			this.exception('no_parameter_for_me');
		}
		this.parent = null;
		this['parent'] = this.parent;
		this.type = null;
		this['type'] = this.type;
		this.def = null;
		this['def'] = this.def;
		this.label = null;
		this['label'] = this.label;
		this.autoSave = null;
		this['autoSave'] = this.autoSave;
		this.store = null;
		this['store'] = this.store;
		this.value = null;
		this['store'] = this.value;
		Cobject.call(this, options, [
				'parent', 'type', 'def', 'label', 'autoSave'
		]);

		if (this.autoSave) {
			this.store = new Clocal_storage();
		}
		if (!options['parent'] && this['className'] != 'Cparameter') {
			this.exception('mandatory_argument_missing', 'parent');
			return null;
		}
		this.__post_init(options);
		return this;
	};

	/**
	 * Inheritance
	 */
	Cparameter.prototype = Object.create(Cobject.prototype);
	Cparameter.prototype.constructor = new Cobject();

	/**
	 * Executed after init subclass must not overide this
	 * 
	 * @private
	 * @param {Hash}
	 *            Constructor hash
	 */
	Cparameter.prototype.__post_init = function(options) {
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
		for (var k in options) {
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
	Cparameter.prototype['__post_init'] = Cparameter.prototype.__post_init;

	/**
	 * Set our parameter value We are calling _set before actually setting value
	 * to give sub class a chance to alterate value
	 * 
	 * @param {Object}
	 *            value
	 * @returns {Boolean}
	 */
	Cparameter.prototype.set = function(value) {
		if (this.value == value) {
			return false;
		}
		this['value'] = this._set(value);
		if (this['autoSave']) {
			var label = this.make_registry_key();
			this['store'].set(label, this['value']);
		}
		//this.send_trigger('update');
		return true;
	};
	Cparameter.prototype['set'] = Cparameter.prototype.set;

	/**
	 * Stub, called before set() on subclass
	 * 
	 * @param {Object}
	 *            value
	 * @return {Object} our modified value
	 */
	Cparameter.prototype._set = function(value) {
		return value;
	};
	Cparameter.prototype['_set'] = Cparameter.prototype._set;
	
	/**
	 * Setting parameter value to is default
	 * 
	 * @return Parameter value
	 */
	Cparameter.prototype.reset = function() {
		this.set(this.def);
		return this.get();
	};
	Cparameter.prototype['reset'] = Cparameter.prototype.reset;

	/**
	 * 
	 * @returns
	 */
	Cparameter.prototype.get = function() {
		return this._get(this.value);
	};
	Cparameter.prototype['get'] = Cparameter.prototype.get;
	
	/**
	 * 
	 * @param value
	 * @returns
	 */
	Cparameter.prototype._get = function(value) {
		return value;
	};
	Cparameter.prototype['_get'] = Cparameter.prototype._get;
	
	/**
	 * 
	 * @returns
	 */
	Cparameter.prototype.make_registry_key = function() {
		var classname = this['parent']['className'];
		var label = this['parent']['label'];
		if (!classname) this.exception('no_classname_in_parent');
		if (!label) this.exception('no_label_in_parent');
		var key = classname + '-' + label + '-' + this.label;
		return key.toLowerCase();
	};
	Cparameter.prototype['make_registry_key'] = Cparameter.prototype.make_registry_key;
	
	/**
	 * Method to_s
	 * Graphit[js/lib/parameters/Cparameter.js]
	 * sho / 12 déc. 2012 / 12:57:51
	 * @param opt {Hash} Hash options
	 */
	Cparameter.prototype.to_s = function(opt) {
		opt = opt || {};
		nl = opt.nl || "\n";
		var str = '['+this['className']+']' + nl;
		str += ' - label: ' + this['label'] + nl;
		return str;
	};
	Cparameter.prototype['to_s'] = Cparameter.prototype.to_s;
	
	/**
	 * Method __test
	 * Graphit[js/lib/parameters/Cparameter.js]
	 * sho / 12 déc. 2012 / 12:16:23
	 * @param dumbopt {String} dumbstring
	 */
	Cparameter.prototype.__test = function() {
		var Cparameter = graphit.import(this['className']);
		var keyTest = '__TEST__';
		var p = new Cparameter({'autoSave': true, 'parent': this, 'def': 'Test', 'type': this['Etype']['numeric']});
		p.set(keyTest, keyTest);
//		var value = p.get(keyTest);
//		if (value != keyTest) {
//			throw(this['className'] + '_set_value_mismach');
//		}
		return true;
	};
	Cparameter.prototype['__test'] = Cparameter.prototype.__test;
	
	// Export
	graphit.export('Cparameter', Cparameter);
	
})(window, graphit, console, undefined);
