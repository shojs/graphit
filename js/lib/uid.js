(function(window, graphit, console, undefined) {

	'use strict';
	
	var modulePath = 'lib/uid';
	
	var DEBUG = (graphit.debug > 10)? true: false;
	
	/**
	 * @constructor Generate Unique ID. Main usage of this uid is for binding
	 *              element together with triggered event. We generate id that
	 *              can't collide with other event.
	 * @param options {Hash} 
	 */
	var Module = function(options) {
		options = options || {};
		this.prefix = 'shojs-';
		this.postfix = 'graphit';
		this.id = null;
		this.className = modulePath;
		//this.init(options);
	}

	Module.prototype.init = function(options) {};
	Module.prototype['init'] = Module.prototype.init;

	/**
	 * @private
	 * @return {string} our fragment string
	 */
	Module.prototype.__get_frag = function() {
		var max = 65535;
		var i = Math.round(Math.random() * Date.now() / (max * 10));
		var txt = i + '';
		i = parseInt(txt.slice(0, 5));
		return helper_format_number_length(i, 5);
	};
	Module.prototype['__get_frag'] = Module.prototype.__get_frag;

	/**
	 * @param maxtry {Int}
	 * @return {String} UID string
	 */
	Module.prototype.gen = function(maxtry) {
		if (maxtry == undefined) {
			maxtry = 3;
		}
		var str = this.prefix;
		for ( var i = 0; i < 2; i++) {
			str += this.__get_frag() + '-';
		}
		str += this.postfix;
		this.last_id = str;
		return str;
	};
	Module.prototype['gen'] = Module.prototype.gen;

	/**
	 * Method __test
	 * Graphit[js/lib/Module.js]
	 * sho / 12 déc. 2012 / 10:00:02
	 */
	Module.prototype.__test = function() {
		var M = graphit.import('lib/uid');
		var m = new M();
		if (DEBUG) {
			console.log(m);
			console.log('Testing uid', m.gen());
		}
		return true;
	};
	Module.prototype['__test'] = Module.prototype.__test;
	
	/**
	 * 
	 */
	graphit.export(modulePath, Module);
	
})(window, graphit, console);
