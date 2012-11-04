function Clocal_storage() {
	this.store = null;
	this.test_compatibility();
}

Clocal_storage.prototype.test_compatibility = function() {
	if (('localStorage' in window) && window['localStorage'] != null) {
		this.store = window.localStorage;
	} else {
		console.error('Your web browser doesn\'t support web storage');
	}
	return this.compatible;
};

Clocal_storage.prototype.get = function(k) {
	if (this.store && k in this.store)
		return this.store[k];
	return null;
};

Clocal_storage.prototype.set = function(k, v) {
	if (!this.store)
		return null;
	this.store[k] = v;
};

var key = 'time_first_run';
var cStore = new Clocal_storage();
var lr = cStore.get(key);
console.log(' Run: ' + lr);