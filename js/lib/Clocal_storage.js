/**
 * Clocal_storage
 * This is just a layer for accessing a key/value registry.
 * If browser support local storage we use it, else we are
 * using simple hash
 * 
 * It's a bit tricky because we install our store as class data
 * so we can acces it like this: <pre>Clocal_storage._store</pre>
 */
function Clocal_storage() {
	this.className = 'Clocal_storage';
	this.first_install();
}

/**
 *
 */
Clocal_storage.prototype.first_install = function(dumbopt) {
	if ('_store' in Clocal_storage) return;
	console.log('Installing our DataStore');
	if (this.test_compatibility()) {
		Clocal_storage._store = window.localStorage;
		if (!this.test_insert()) {
			Clocal_storage._store = {};
		}
	} else {
		Clocal_storage._store = {};
	}
};

Clocal_storage.prototype.test_compatibility = function() {
	if (('localStorage' in window) && window['localStorage'] != null) {
		return true;
	}
	console.error('Your web browser doesn\'t support web storage');
	return false;
};

/**
 *
 */
Clocal_storage.prototype.test_insert = function() {
	var key = '_____TEST_INSERT_VALUE_____';
	try {
		this.set(key, key);
	} catch(e) {
		return false;
	}
	this.remove(key);
	return true;
};

/**
 *
 */
Clocal_storage.prototype.remove = function(key) {
	if ('removeItem' in Clocal_storage._store) {
		return Clocal_storage._store.removeItem(key);
	} 
	delete Clocal_storage._store[key];
};

Clocal_storage.prototype.get = function(k) {
	if (Clocal_storage._store && k in Clocal_storage._store)
		return Clocal_storage._store[k];
	return null;
};

Clocal_storage.prototype.set = function(k, v) {
	if (!Clocal_storage._store)
		return null;
	try {
		if ('removeItem' in Clocal_storage._store) {
			Clocal_storage._store.removeItem(k);
		}
		Clocal_storage._store[k] = v;
	} catch(e) {
		var me = new Cexception_message({
			label: 'store_new_value_failed',
			className: this.className,
			object: this,
			additional: 'key: ' + k + ' / value: ' + v,
			original : e
		});
		console.error(me.to_s(), e);
	}
};

window.graphit.storage = new Clocal_storage();