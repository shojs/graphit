/**
 * Class  CgraphitAuth
 * 21:21:38 / 2 d�c. 2012 [graphit - nosferat.us] sho 
 */
function CgraphitAuth(options) {
    options = options || {};
    options.className = "CgraphitAuth";
    options.label = "CgraphitAuth";
    options.disable = (options.disable != undefined)? options.disable: false;
    this.__init_singleton(options);
//    Cobject.call(this, options, []);
}

/* Inheritance */
//CgraphitAuth.prototype = Object.create(Cobject.prototype);
//CgraphitAuth.prototype.constructor = new Cobject();


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
	var r = $('<div title="Graphit Authentication" />');
	r.addClass('group group-graphit-authentication');
	var iframe = $('<iframe id="graphit-authentication-iframe" />');
	iframe.attr('src', '/php/googleIdentity/index.php');
	iframe.addClass('group group-graphit-authentication-iframe');
	iframe.attr('width', '100%');
	iframe.attr('height', '100%');
	iframe.css('overflow', 'visible');
	r.append(iframe);
	this.rootElm = r;
	return this;
};