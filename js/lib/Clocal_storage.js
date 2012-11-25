function Clocal_storage() {
	this.className = 'Clocal_storage';
	this.store = {};
	if (this.test_compatibility()) {
		this.store = window.localStorage;
		if (!this.test_insert()) {
			this.store = {};
		}
	}
}

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
Clocal_storage.prototype.test_insert = function(dumbopt) {
	try {
		this.set('test_insert_value', 'test_insert_value');
	} catch(e) {
		return false;
	}
	this.remove('test_insert_value');
	return true;
};

/**
 *
 */
Clocal_storage.prototype.remove = function(key) {
	if ('removeItem' in this.store) {
		return this.store.removeItem(key);
	} else {
		delete this.store[key];
	}
};

Clocal_storage.prototype.get = function(k) {
	if (this.store && k in this.store)
		return this.store[k];
	return null;
};

Clocal_storage.prototype.set = function(k, v) {
	if (!this.store)
		return null;
	try {
		if ('removeItem' in this.store) {
			console.log('Removing item from store', k);
			this.store.removeItem(k);
		}
		this.store[k] = v;
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

//var key = 'time_first_run';
var cStore = new Clocal_storage();
////console.log(' Run: ' + lr);