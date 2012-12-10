/**
 * Class  CgraphitAuth
 * 21:21:38 / 2 d�c. 2012 [graphit - nosferat.us] sho 
 */
function CgraphitAuth(options) {
    var that = this;
	options = options || {};
    options.className = "CgraphitAuth";
    options.label = "CgraphitAuth";
    options.disable = (options.disable != undefined)? options.disable: false;
    this.selected = null;
    options.dialog_options = options.dialog_options || {
    		modal: false,
    		width: 200,
    };
    this.__init_singleton(options);
    Cobject.call(this, options, ['dialog_options']);
    if (this.hasValidAccount()) {
    	//#TODO: Checing valid account or erase it from cache
    }
    this.bind_trigger(this, 'update', function(e) {
    	that.update();
    });
}

/* Inheritance */
CgraphitAuth.prototype = Object.create(Cobject.prototype);
CgraphitAuth.prototype.constructor = new Cobject();

/**
 *
 */
CgraphitAuth.prototype.hasValidAccount = function() {
	if (!('storage' in graphit)) return null;
	var acc = graphit.storage.get('chooserAccounts');
	if (!acc) { return null; }
	acc = JSON.parse(acc);
	return acc;
};

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
	console.log('Auth', key, value);
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
 *@private
 */
CgraphitAuth.prototype.__replace_accounts = function() {
	var that = this;
	var elm = this.rootElm.children('.group-graphit-authentication').empty();
	var accounts = this.hasValidAccount();
	cEach(accounts, function(i, data) {
		var g = $('<div />');
		var img =  $('<img />');
		img.addClass('photoUrl');
		img.attr('src', data.photoUrl);
		img.attr('alt', 'photoUrl');
		g.append(img);
		g.append('<b class="displayName">' + data.displayName + '</b>');
		g.append('<b class="email">' + data.email);
		that.ajax_is_logged({email: data.email, callback_error: function() {
			console.warn('removing email', data.email);
			
		}});
		elm.append(g);
	});
	if (accounts && accounts.length > 0) {
		var logout = $('<div class="logout" />');
		var b = $('<button />');
		b.append(T('menu_logout')),
		b.button({

		});
		b.click(function() {
			window.graphit.storage.remove('chooserAccounts');
			deleteAllCookies();
			that.ajax_logout({
				email: '',
				callback_success: function() {
					console.log('logout');
					elm.empty();
				}
			});
			//window.open('php/GoogleIdentity2/logout/index.php', 'graphit_auth');
			that.send_trigger('update');
		});
		logout.append(b);
		elm.append(logout);
	}
};

/**
 *
 */
CgraphitAuth.prototype.update = function() {
	this.__replace_accounts();
};

/**
 *
 */
CgraphitAuth.prototype.dom_build = function() {
	var that = this;
	var graphit = window.graphit;
	var rr = $('<div title="Graphit Authentication"/>');
	var r = $('<div  />');
	r.addClass('group group-graphit-authentication');
	rr.append(r);

	this.rootElm = rr;
	this.__replace_accounts();
	return this;
};

/**
 *
 */
CgraphitAuth.prototype.ajax_is_logged = function(opt) {
	var that = this;
	var request = $.ajax({
		  type: "POST",
		  url: "php/GoogleIdentity2/logged/",
		  data: { email:  opt.email}
	});
	if ('callback_succces' in opt) {
		request.done(function(msg) {
			opt.callback_succes.call(that, msg);
		});
	} else if ('callback_error' in opt) {
		request.error(function(jqXHR, textStatus) {
			opt.callback_error.call(that, jqXHR, textStatus);
		});
	}  
};

/**
*
*/
CgraphitAuth.prototype.ajax_logout = function(opt) {
	var that = this;
	var request = $.ajax({
		  type: "POST",
		  url: "php/GoogleIdentity2/logout/",
		  data: { email:  opt.email}
	});
	if ('callback_success' in opt) {
		request.done(function(msg) {
			opt.callback_success.call(that, msg);
		});
	} else if ('callback_error' in opt) {
		request.error(function(jqXHR, textStatus) {
			opt.callback_error.call(that, jqXHR, textStatus);
		});
	}  
};

if (window.graphit.authEnable) {
	window.graphit.auth = new CgraphitAuth();
}

