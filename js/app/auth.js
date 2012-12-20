(function(window, graphit, console, undefined) {
	
	'use strict';
	
	var modulePath = 'app/auth';
	
	/**
	 * Import
	 */
	var Cobject = graphit.import('lib/object');
	
	/**
	 * @constructor Class Module 21:21:38 / 2 d�c. 2012 [graphit -
	 *              nosferat.us] sho
	 */
	var Module = function(options) {
		var that = this;
		options = options || {};
		options.className = modulePath;
		options.label = modulePath;
		options.disable = (options.disable != undefined) ? options.disable
				: false;
		this.selected = null;
		options.dialog_options = options.dialog_options || {
			modal : false,
			width : 200,
		};
		this.__init_singleton(options);
		Cobject.call(this, options, [
			'dialog_options'
		]);
		if (this.hasValidAccount()) {
			// #TODO: Checing valid account or erase it from cache
		}
		this.bind_trigger(this, 'update', function(e) {
			that.update();
		});
	}

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 *
	 */
	Module.prototype.hasValidAccount = function() {
		var graphit = window['graphit'];
		if (!('storage' in graphit)) return null;
		var acc = graphit.storage.get('chooserAccounts');
		if (!acc) {
			return null;
		}
		acc = JSON.parse(acc);
		return acc;
	};

	/**
	 * Init our class as a singleton
	 * 
	 * @private
	 */
	Module.prototype.__init_singleton = function(options) {
		if (!('__data' in Module)) {
			Module.__data = {};
		}
		if (!('__disable' in Module)) {
			Module.__disable = options.disable;
		}
	};

	/**
	 *
	 */
	Module.prototype.copy = function(cAuth) {
		for (key in cAuth.get_data()) {
			console.log('Copy', key);
			this.set(key, cAuth.get(key));
		}
	};

	/**
	 *
	 */
	Module.prototype.get_data = function() {
		return Module.__data;
	};

	/**
	 *
	 */
	Module.prototype.is_logged = function() {
		return this.get('verifiedEmail');
	};

	/**
	 *
	 */
	Module.prototype.is_disable = function(dumbopt) {
		return Module.__disable;
	};

	/**
	 *
	 */
	Module.prototype.set = function(key, value) {
		console.log('Auth', key, value);
		Module.__data[key] = value;
	};

	/**
	 *
	 */
	Module.prototype.get = function(key) {
		if (!(key in Module.__data)) {
			console.warn('key doesn\'t exists', key);
			return null;
		}
		return Module.__data[key];
	};

	/**
	 *
	 */
	Module.prototype.each = function(callback) {
		if (!callback || typeof callback != 'function') {
			throw 'invalid_callback';
		}
		for ( var label in Module.__data) {
			callback.call(Module.__data, label, this.get(label));
		}
	};

	/**
	 *
	 */
	Module.prototype.dom_get = function(force) {
		if (this.rootElm && (force == undefined || !force)) {
			return this.rootElm;
		}
		return this.dom_build().rootElm;
	};

	/**
	 * @private
	 */
	Module.prototype.__replace_accounts = function() {
		var that = this;
		var elm = this.rootElm.children('.group-graphit-authentication')
				.empty();
		var accounts = this.hasValidAccount();
		cEach(accounts, function(i, data) {
			var g = $('<div />');
			var img = $('<img />');
			img.addClass('photoUrl');
			img.attr('src', data.photoUrl);
			img.attr('alt', 'photoUrl');
			g.append(img);
			g.append('<b class="displayName">' + data.displayName + '</b>');
			g.append('<b class="email">' + data.email);
			that.ajax_is_logged({
				email : data.email,
				callback_error : function() {
					console.warn('removing email', data.email);

				}
			});
			elm.append(g);
		});
		if (accounts && accounts.length > 0) {
			var logout = $('<div class="logout" />');
			var b = $('<button />');
			b.append(T('menu_logout')), b.button({

			});
			b.click(function() {
				window.graphit.storage.remove('chooserAccounts');
				deleteAllCookies();
				that.ajax_logout({
					email : '',
					callback_success : function() {
						console.log('logout');
						elm.empty();
					}
				});
				// window.open('php/GoogleIdentity2/logout/index.php',
				// 'graphit_auth');
				that.send_trigger('update');
			});
			logout.append(b);
			elm.append(logout);
		}
	};

	/**
	 *
	 */
	Module.prototype.update = function() {
		this.__replace_accounts();
	};

	/**
	 *
	 */
	Module.prototype.dom_build = function() {
		// var that = this;
		// var graphit = window.graphit;
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
	Module.prototype.ajax_is_logged = function(opt) {
		var that = this;
		var base = window.graphit.baseRestContent;
		var request = $.ajax({
			type : "POST",
			url : base + "gi/logged",
			data : {
				email : opt.email
			}
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
	Module.prototype.ajax_logout = function(opt) {
		var that = this;
		var base = window.graphit.baseRestContent;
		var request = $.ajax({
			type : "POST",
			url : base + "gi/logout",
			data : {
				email : opt.email
			}
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

	/**
	 * Export
	 */
	graphit.export(modulePath, Module);

})(window, graphit, console);
