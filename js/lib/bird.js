/**
 * Module lib/bird
 * graphit[js/lib/bird.js]
 * sho / 14 déc. 2012 / 06:31:35
 */
(function(window, graphit, console, undefined) {

	'use strict';

	var DEBUG = graphit.debug;
	var modulePath = 'lib/bird';

	var status = {
			'loading': 1,
			'done'   : 2,
			'error'  : 3,
	};
//	var Cobject = graphit.import('lib/object');

	/**
	 * graphit[js/lib/bird.js]
	 * sho / 14 déc. 2012 / 06:31:35
	 * @constructor
	 * @param options {Hash} Constructor options
	 */
	var Module = function(options) {
		options = options || {};
		options['className'] = modulePath;
		options['label'] = modulePath;
//		Cobject.call(this, options, []);
		this.init(options);
	};

	/* Inheritance */
//	Module.prototype = Object.create(Cobject.prototype);
//	Module.prototype.constructor = new Cobject();

	/**
	 * Method init
	 * graphit[js/lib/bird.js]
	 * sho / 14 déc. 2012 / 06:33:19
	 * @param options {Hash} Constructor options
	 */
	Module.prototype.init = function(options) {
		for (var label in options) {
			this[label] = options[label];
		}
		this['needed'] = {};
		this['exported'] = {};
		this.loading = 0;
		this.install_hook();
	};
	
	/**
	 * Method _import
	 * graphit[js/lib/bird.js]
	 * sho / 14 déc. 2012 / 06:57:57
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype._import = function(dumbopt) {
		// dumb comment
	};
	
	/**
	 * Method _export
	 * graphit[js/lib/bird.js]
	 * sho / 14 déc. 2012 / 06:58:08
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype._export = function(dumbopt) {
		// dumb comment
	};
	
	/**
	 * Method install_hook
	 * graphit[js/lib/bird.js]
	 * sho / 14 déc. 2012 / 06:49:58
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.install_hook = function(dumbopt) {
		/* Intercepting normal import */
		console.log('Bird\s hooking import/export');
		this._import = graphit.import;
		this._export = graphit.export;
		graphit.import = this.import;
		graphit.export = this.export;
	};
	
	/**
	 * Method import
	 * graphit[js/lib/bird.js]
	 * sho / 14 déc. 2012 / 06:32:41
	 * @param path {String} Import path
	 */
	Module.prototype.import = function(path) {
		var pat = /(\/)/g;
		var mypath = path.replace(pat, '_');
		console.log('Hook IMPORT', path, mypath, this);
		if (mypath in this.egg) {
			return this.egg[mypath];
		}
		if (!(mypath in this.bird.needed)) {
			return this.bird.load(this, path);
		}
		return this.bird.needed[path].object;
	};
	
	
	/**
	 * Method export
	 * graphit[js/lib/bird.js]
	 * sho / 14 déc. 2012 / 06:51:53
	 * @param path {String} Export path
	 * @param egg {Function/Object} Module to be exported
	 */
	Module.prototype.export = function(path, egg) {
		var pat = /(\/)/g;
		var mypath = path.replace(pat, '_');
		console.log('Hook EXPORT', path);
		//this.bird.needed[mypath].object = egg;
		//this.bird.exported[mypath] = egg;
		this.bird._export.call(this, path, egg);
	};
	
	/**
	 * Method load
	 * graphit[js/lib/bird.js]
	 * sho / 14 déc. 2012 / 07:30:54
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.load = function(that, path) {
		//var that = this;
		this.loading++;
		var that = this;
		var pat = /(\/)/g;
		var mypath = path.replace(pat, '_');
		this.needed[path] = {
				status: status.loading,
				object: function() { 
					console.error('BIRD STUB ' + path);
				}
		};
		var s = document.createElement('script');
		s.setAttribute('type', 'text/javascript');
		s.setAttribute('src', 'js/' + path + '.js');
		s.onload = function() {
			console.log('Egg loaded', mypath);
			that.needed[path] = null;
			console.log('Loading', that.loading);
			that.loading--;
			that._export.call(that, path, graphit.egg[mypath]);
		};
		var root = document.getElementsByTagName('script')[0];
		if (!root) root = document.head;
		root.parentNode.insertBefore(s, root);
		return this.needed[path]['object'];
	};
	
	/**
	 * Method to_s
	 * graphit[js/lib/bird.js]
	 * sho / 14 déc. 2012 / 07:20:16
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.to_s = function() {
		var nl = "\n";
		var str = '['+this.className+']' + nl;
		str+= "Needed:" + nl;
		for(var label in this.needed) {
			var status = 'Ok';
			if (this.needed[label].status == status.loading) {
				status == 'Loading';
			}
			str+= '['+status+']' + label + ': ' + this.needed[label] + nl;
		}
		return str;
	};
	
	/**
	 * Test
	 */
	Module.prototype.__test = function() {
		;
	};
	
	/* Export */
	graphit.export(modulePath, Module);
	
	graphit['bird'] = new Module();

})(window, graphit, console);