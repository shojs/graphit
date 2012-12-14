(function(window, graphit, console, undefined) {
	
	'use strict';
	
	var modulePath = 'lib/localStorage';
	
	var DEBUG = (graphit.debug >= 10)? true: false;
	
	/**
	 * @constructor
	 */
	var Module = function() {
		this.className = modulePath;
		this.init();
	};

	/**
	 * @private
	 */
	Module.prototype.init = function() {
		if (this.test_compatibility()) {
			this.store = window['localStorage'];
			if (!this.test_insert()) {
				this.store = {};
			}
		} else {
			this.store = {};
		}
	};
	Module.prototype['first_install'] = Module.prototype.first_install;

	/**
	 * test_compatibility
	 * @returns {Boolean}
	 */
	Module.prototype.test_compatibility = function() {
		if (('localStorage' in window) && window['localStorage'] != null) {
			return true;
		}
		console.error('Your web browser doesn\'t support web storage');
		return false;
	};
	Module.prototype['test_compatibility'] = Module.prototype.test_compatibility;

	/**
	 * Test_insert
	 */
	Module.prototype.test_insert = function() {
		var key = '_____TEST_INSERT_VALUE_____';
		try {
			this.set(key, key);
		} catch (e) {
			return false;
		}
		this.remove(key);
		return true;
	};
	Module.prototype['test_insert'] = Module.prototype.test_insert;

	/**
	 * List
	 */
	Module.prototype.list = function() {
		return this.store;
	};
	Module.prototype['list'] = Module.prototype.list;

	/**
	 * Remove
	 */
	Module.prototype.remove = function(key) {
		if (DEBUG) console.log('Removing key', key);
		if ('removeItem' in this.store) {
			return this.store.removeItem(key);
		}
		delete this.store[key];
	};
	Module.prototype['remove'] = Module.prototype.remove;

	/**
	 * get
	 * @param k
	 * @returns
	 */
	Module.prototype.get = function(k) {
		if (DEBUG) console.log('Get key', key);
		if (this.store && k in this.store) return this.store[k];
		return null;
	};
	Module.prototype['get'] = Module.prototype.get;

	/**
	 * Set
	 * @param k
	 * @param v
	 */
	Module.prototype.set = function(k, v) {
		if (DEBUG) console.log('Setting', k, 'with', v, 'into', this.store);
		if (!this.store) {
			console.error('Storage not set');
		}
		try {
			if ('removeItem' in this.store) {
				this.store.removeItem(k);
			}
			this.store[k] = v;
		} catch (e) {
			var me = new Cexception_message({
				'label' : 'store_new_value_failed',
				'className' : this.className,
				'object' : this,
				'additional' : 'key: ' + k + ' / value: ' + v,
				'original' : e
			});
			console.error(me.to_s(), e);
		}
	};
	Module.prototype['set'] = Module.prototype.set;

	Module.prototype.__test = function() {
		var keyTest = '__TEST__';
		var M = graphit.import(modulePath);
		var m = new M();
		m.set(keyTest, keyTest);
		var value = m.get(keyTest);
		if (value != keyTest) {
			throw(m.className + '_cannot_fetch_key');
		}
		for ( var key in m.list()) {
			var value = m.get(key);
			if (DEBUG) console.log(key, value);
		}
		m.remove('__TEST__');
		for ( var key in m.list()) {
			var value = m.get(key);
			if (DEBUG) {
				console.log(key, value);
			}
		}
		return true;
	};
	Module.prototype['__test'] = Module.prototype.__test;
	
	graphit.export(modulePath, Module);
	
})(window, graphit, console);
