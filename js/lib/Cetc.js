function Cetc() {
	this.store = null;
	this.localStorage = new Clocal_storage();
	if (this.localStorage.store) {
		this.store = this.localStorage.store;
	} else {
		this.store = new Array();
	}
}

Cetc.prototype.set = function(k, v) {
	//console.log('set ',k, ' = ', v);
	this.store[k] = v;
	return this;
};

Cetc.prototype.get = function(k) {
	return this.store[k];
};


Cetc.prototype.get_set = function(k, v) {
	var ret;
	this.store[k + '_default'] = v;
	if (ret = this.get(k)) {
		return ret;
	}
	this.store[k] = v;
	return v;
};


