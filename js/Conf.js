/*
 * Main namespace
 */
var graphit = { 'foo': 'bar'};
window.graphit = graphit;
window['graphit'] = window.graphit;

(function(window, graphit, console, undefined) {

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
		this['bird'] = {};
		for ( var k in conf) {
			if (conf.debug >= 10) {
				console.log('Setting global', k, conf[k]);
			}
			this[k] = conf[k];
		}
	};

	Module.prototype.import = function(name) {
		var pat = /(\/)/g;
		name = name.replace(pat, '_');
		if (!this['bird'] || !this['bird'][name]) {
			throw('import_non_existing_module__' + name);
			return null;
		}
		if (this['bird'][name]) {
			return this['bird'][name];
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
	Module.prototype.export = function(name, bird) {
		var pat = /(\/)/g;
		name = name.replace(pat, '_');
		console.log('[Bird] add *', name,'*');
		if (!name || !bird || typeof name == 'function' || (typeof bird != 'function' && typeof bird != 'object')) {
			throw('add_bird_require_two_parameters');
		}
		this['bird'][name] = bird;
	};
	Module.prototype['export'] = Module.prototype.export;

	/**
	 * Method __test
	 * graphit[js/Conf.js]
	 * sho / 13 déc. 2012 / 02:14:50
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.__test = function() {
//		var conf = new (this.import('Module'))(MyConf);
//		console.log(conf.to_s());
		return true;
	};
	
	Module.prototype['__test'] = Module.prototype.__test;
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
	
	window.graphit = new Module(MyConf);
	window.graphit.export('graphit', Module);
	console.log('Namespace << graphit >> added (window.graphit)');
})(window, graphit, console);
window['graphit'] = graphit;
