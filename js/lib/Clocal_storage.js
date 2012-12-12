(function($Graphit) {
	'use strict';
	window.graphit = window['graphit'];
	var getBird = window.graphit['getBird'];
	/**
	 * @constructor Clocal_storage This is just a layer for accessing a
	 *              key/value registry. If browser support local storage we use
	 *              it, else we are using simple hash It's a bit tricky because
	 *              we install our store as class data so we can acces it like
	 *              this:
	 * 
	 * <pre>
	 * Clocal_storage._store
	 * </pre>
	 */
	var Clocal_storage = function() {
		this.className = 'Clocal_storage';
		this.first_install();
		this['store'] = {};
	};

	/**
	 *
	 */
	Clocal_storage.prototype.first_install = function(dumbopt) {
		if (this.test_compatibility()) {
			this.store = window.localStorage;
			if (!this.test_insert()) {
				this.store = {};
			}
		} else {
			this.store = {};
		}
	};
	Clocal_storage.prototype['first_install'] = Clocal_storage.prototype.first_install;

	/**
	 * test_compatibility
	 * @returns {Boolean}
	 */
	Clocal_storage.prototype.test_compatibility = function() {
		if (('localStorage' in window) && window['localStorage'] != null) {
			return true;
		}
		console.error('Your web browser doesn\'t support web storage');
		return false;
	};
	Clocal_storage.prototype['test_compatibility'] = Clocal_storage.prototype.test_compatibility;

	/**
	 * Test_insert
	 */
	Clocal_storage.prototype.test_insert = function() {
		var key = '_____TEST_INSERT_VALUE_____';
		try {
			this.set(key, key);
		} catch (e) {
			return false;
		}
		this.remove(key);
		return true;
	};
	Clocal_storage.prototype['test_insert'] = Clocal_storage.prototype.test_insert;

	/**
	 * List
	 */
	Clocal_storage.prototype.list = function(dumbopt) {
		return this.store;
	};
	Clocal_storage.prototype['list'] = Clocal_storage.prototype.list;

	/**
	 * Remove
	 */
	Clocal_storage.prototype.remove = function(key) {
		if ('removeItem' in this.store) {
			return this.store.removeItem(key);
		}
		delete store[key];
	};
	Clocal_storage.prototype['remove'] = Clocal_storage.prototype.remove;

	/**
	 * get
	 * @param k
	 * @returns
	 */
	Clocal_storage.prototype.get = function(k) {
		if (this.store && k in this.store) return this.store[k];
		return null;
	};
	Clocal_storage.prototype['get'] = Clocal_storage.prototype.get;

	/**
	 * Set
	 * @param k
	 * @param v
	 */
	Clocal_storage.prototype.set = function(k, v) {
		console.log('Setting', k, 'with', v, 'into', this.store);
		if (!this.store) {
			console.error('Storage not set');
		}
		;
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
	Clocal_storage.prototype['set'] = Clocal_storage.prototype.set;

	Clocal_storage.prototype.__test = function() {
		var keyTest = '__TEST__';
		var Clocal_storage = getBird('Clocal_storage');
		window.graphit.storage = new Clocal_storage();
		window.graphit['storage'] = window.graphit.storage;
		console.log('Listing keys in storage');
		console.log('Add key');
		graphit.storage.set(keyTest, keyTest);
		var value = graphit.storage.get(keyTest);
		if (value != keyTest) {
			throw(this.className + '_cannot_fetch_key');
		}
		console.log('Fetching key', keyTest, 'Ok');
		for ( var key in graphit.storage.list()) {
			console.log(key, graphit.storage.get(key));
		}
		console.log('Remove key');
		graphit.storage.remove('__TEST__');
		for ( var key in graphit.storage.list()) {
			console.log(key, graphit.storage.get(key));
		}
		return true;
	};
	Clocal_storage.prototype['__test'] = Clocal_storage.prototype.__test;
	
	/**
	 * Export
	 */
	$Graphit['_class_pool']['Clocal_storage'] = Clocal_storage;
})(graphit);
