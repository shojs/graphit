/**
 * @constructor
 * @returns
 */
function Cregistry() {
	this.store = null;
	this.localStorage = new Clocal_storage();
	if (this.localStorage.store) {
		this.store = this.localStorage.store;
	} else {
		this.store = new Array();
	}
}

Cregistry.prototype.set = function(k, v) {
	// console.log('set ',k, ' = ', v);
	this.store[k] = v;
	return this;
};

Cregistry.prototype.get = function(k) {
    //console.log('Get key', k);
    	//console.log('Registry get(' + k + ')');
	return this.store[k];
};

Cregistry.prototype.get_set = function(k, v) {
	var ret;
	this.store[k + '_default'] = v;
	if (ret = this.get(k)) {
		return ret;
	}
	this.store[k] = v;
	return v;
};
