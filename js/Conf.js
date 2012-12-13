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
		'baseRestContent' : '/',
	};

	var Cconf = function(conf) {
		console.log(window, graphit);
		this['bird'] = {};
		for ( var k in conf) {
			console.log('Setting global', k, conf[k]);
			this[k] = conf[k];
		}
	};

	Cconf.prototype.import = function(name) {
		if (!this['bird']) {
			console.error('No bird in graphit');
			return null;
		}
		if (this['bird'][name]) {
			return this['bird'][name];
		}
		return null;
	};
	Cconf.prototype['import'] = Cconf.prototype.import;

	/**
	 * Method add
	 * graphit[js/Conf.js]
	 * sho / 12 déc. 2012 / 23:14:32
	 * @param dumbopt {String} dumbstring
	 */
	Cconf.prototype.export = function(name, bird) {
		console.log('[Bird] add *', name,'*');
		if (!name || !bird || typeof name == 'function' || typeof bird != 'function') {
			throw('add_bird_require_two_parameters');
		}
		this['bird'][name] = bird;
	};
	Cconf.prototype['export'] = Cconf.prototype.export;

	/**
	 * Method __test
	 * graphit[js/Conf.js]
	 * sho / 13 déc. 2012 / 02:14:50
	 * @param dumbopt {String} dumbstring
	 */
	Cconf.prototype.__test = function() {
//		var conf = new (this.import('Cconf'))(MyConf);
//		console.log(conf.to_s());
		return true;
	};
	
	Cconf.prototype['__test'] = Cconf.prototype.__test;
	/**
	 * Method to_s
	 * graphit[js/Conf.js]
	 * sho / 12 déc. 2012 / 23:41:53
	 * @param dumbopt {String} dumbstring
	 */
	Cconf.prototype.to_s = function(dumbopt) {
		for(var k in this) {
			console.log(k, this[k]);
		}
	};
	Cconf.prototype['to_s'] = Cconf.prototype.to_s;
	
	window.graphit = new Cconf(MyConf);
	window.graphit.export('Cconf', Cconf);
	console.log('Namespace << graphit >> added (window.graphit)');
})(window, graphit, console);
window['graphit'] = graphit;
