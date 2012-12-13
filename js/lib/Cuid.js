(function(window, graphit, console, undefined) {

	'use strict';
	
	/**
	 * @constructor Generate Unique ID. Main usage of this uid is for binding
	 *              element together with triggered event. We generate id that
	 *              can't collide with other event.
	 * @param options {Hash} 
	 */
	function Cuid(options) {
		options = options || {};
		this.prefix = 'shojs-';
		this.postfix = 'graphit';
		this.id = null;
		//this.init(options);
	}

	Cuid.prototype.init = function(options) {};
	Cuid.prototype['init'] = Cuid.prototype.init;

	/**
	 * @private
	 * @return {string} our fragment string
	 */
	Cuid.prototype.__get_frag = function() {
		var max = 65535;
		var i = Math.round(Math.random() * Date.now() / (max * 10));
		var txt = i + '';
		i = parseInt(txt.slice(0, 5));
		return helper_format_number_length(i, 5);
	};
	Cuid.prototype['__get_frag'] = Cuid.prototype.__get_frag;

	/**
	 * @param maxtry {Int}
	 * @return {String} UID string
	 */
	Cuid.prototype.gen = function(maxtry) {
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
	Cuid.prototype['gen'] = Cuid.prototype.gen;

	/**
	 * Method __test
	 * Graphit[js/lib/Cuid.js]
	 * sho / 12 déc. 2012 / 10:00:02
	 */
	Cuid.prototype.__test = function() {
		var _Cuid = graphit.import('Cuid');
		var g = new _Cuid();
		console.log('g', g);
		console.log('Testing uid', g.gen());
		return true;
	};
	Cuid.prototype['__test'] = Cuid.prototype.__test;
	
	/**
	 * 
	 */
	graphit.export('Cuid', Cuid);
	
})(window, graphit, console);
