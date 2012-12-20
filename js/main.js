/*
 * Main namespace
 */
(function(window, console, undefined) {

	"use strict";

	var MyConf = {
		'version' : '0.1.1',
		'author' : 'showi@github.com',
		/**
		 * 11 All 5 Verbose 1 Normal
		 */
		'debug' : 1,
		/**
		 * Disable/Enable authentication feature (see /php/GoogleIdentity.conf)
		 */
		'authEnable' : false,
		/**
		 * Our global access path
		 */
		'baseStaticContent' : 'http://static-graphit.dev/',
		'baseScriptContent' : '/',
		'baseRestContent' : '/'
	};

	var Module = function(conf) {
		this['egg'] = {};
		for ( var k in conf) {
			if (conf.debug >= 10) {
				console.log('Setting global', k, conf[k]);
			}
			this[k] = conf[k];
		}
	};

	Module.prototype.import = function(name) {
		var pat = /(\/)/g;
		//console.log('[Egg/Import] ' + name);
		name = name.replace(pat, '_');
		if (!this['egg'] || !this['egg'][name]) {
			throw('import_non_existing_module__' + name);
		} else if (this['egg'][name]) {
			return this['egg'][name];
		}
		return null;
	};
	Module.prototype['import'] = Module.prototype.import;

	/**
	 * Method add
	 * graphit[js/Conf.js]
	 * sho / 12 déc. 2012 / 23:14:32
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.export = function(name, egg) {
		var pat = /(\/)/g;
		name = name.replace(pat, '_');
		//console.log('[Egg/Add] ', name);
		if (!name || !egg || typeof name == 'function' || (typeof egg != 'function' && typeof egg != 'object')) {
			throw('add_bird_require_two_parameters');
		}
		this['egg'][name] = egg;
	};
	Module.prototype['export'] = Module.prototype.export;

	/**
	 * Method find
	 * graphit[js/main.js]
	 * sho / 18 déc. 2012 / 22:09:35
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.find = function(search) {
		var pat = /\//g;
		search = search.replace(pat, '_');
		console.log('SEARCH', search);
		var pat = new RegExp('^' + search + '$');
		var results = [];
		for (var path in this.egg) {
			if (pat.exec(path)) results.push(this.egg[path]);
		}
		return results;
	};
	Module.prototype['find'] = Module.prototype.find;

	/**
	 * Method to_s
	 * graphit[js/Conf.js]
	 * sho / 12 déc. 2012 / 23:41:53
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.to_s = function(dumbopt) {
		for(var k in this) {
			console.log(k, this[k]);
		}
	};
	Module.prototype['to_s'] = Module.prototype.to_s;

	/**
	 * Method __test
	 * graphit[js/Conf.js]
	 * sho / 13 déc. 2012 / 02:14:50
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.__test = function() {
		return true;
	};
	Module.prototype['__test'] = Module.prototype.__test;

	/*
	 * Installing our Namespace
	 */
	window.graphit = new Module(MyConf);
	window.graphit.export('graphit', Module);
	console.log('Namespace << graphit >> added (window.graphit)');
	
})(window, console);

//window['graphit'] = graphit;
