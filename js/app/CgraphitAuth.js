/**
 * Class  CgraphitAuth
 * 21:21:38 / 2 d�c. 2012 [graphit - nosferat.us] sho 
 */
function CgraphitAuth(options) {
    options = options || {};
    options.className = "CgraphitAuth";
    options.label = "CgraphitAuth";
    options.disable = (options.disable != undefined)? options.disable: false;
    options.dialog_options = options.dialog_options || {
    		modal: false,
    		width: 600
    };
    this.__init_singleton(options);
    Cobject.call(this, options, ['dialog_options']);
}

/* Inheritance */
CgraphitAuth.prototype = Object.create(Cobject.prototype);
CgraphitAuth.prototype.constructor = new Cobject();


/**
 * Init our class as a singleton
 * @private
 */
CgraphitAuth.prototype.__init_singleton = function(options) {
    if (!('__data' in CgraphitAuth)) {
    	CgraphitAuth.__data = {};
    }
    if (!('__disable' in CgraphitAuth)) {
    	CgraphitAuth.__disable = options.disable;
    }
};

/**
 *
 */
CgraphitAuth.prototype.copy = function(cAuth) {
	for(key in cAuth.get_data()) {
		console.log('Copy', key);
		this.set(key, cAuth.get(key));
	}
};

/**
 *
 */
CgraphitAuth.prototype.get_data = function() {
	return CgraphitAuth.__data;
};

/**
 *
 */
CgraphitAuth.prototype.is_logged = function() {
	return this.get('verifiedEmail');
};

/**
 *
 */
CgraphitAuth.prototype.is_disable = function(dumbopt) {
	return CgraphitAuth.__disable;
};

/**
 *
 */
CgraphitAuth.prototype.set = function(key, value) {
	console.log('set', key, value);
    CgraphitAuth.__data[key] = value;
};

/**
*
*/
CgraphitAuth.prototype.get = function(key) {
    if (!(key in CgraphitAuth.__data)) {
	console.warn('key doesn\'t exists', key);
	return null;
    }
   return CgraphitAuth.__data[key];
};

/**
 *
 */
CgraphitAuth.prototype.each = function(callback) {
    if (!callback || typeof callback != 'function') {
	throw 'invalid_callback';
    }
    for(var label in CgraphitAuth.__data) {
	callback.call(CgraphitAuth.__data, label, this.get(label));
    }
};

/**
 *
 */
CgraphitAuth.prototype.dom_get = function(force) {
	if (this.rootElm  && (force == undefined || !force)) {
		return this.rootElm;
	}
	return this.dom_build().rootElm;
};

/**
 *
 */
CgraphitAuth.prototype.dom_build = function() {
	var graphit = window.graphit;
	var r = $('<div title="Graphit Authentication" />');
	r.addClass('group group-graphit-authentication');
	var src = '';
	if (src = graphit.auth.get('photoUrl')) {
		var photo = $('<img class="photoUrl"/>');
		photo.attr('src', src);
		r.append(photo);
	}
	var displayName = $('<p class="displayName" />');
	displayName.append(graphit.auth.get('displayName'));
	r.append(displayName);
	console.log(window.google);
	this.rootElm = r;
	return this;
};
window.graphit.auth = new CgraphitAuth();