(function(window, $Graphit, undefined) {
	'use strict';
	window.graphit = $Graphit;
	var getBird = window.graphit['getBird'];
	//var Cuid = getBird('Cuid');
	/**
	 * @constructor Generate Unique ID. Main usage of this uid is for binding
	 *              element together with triggered event. We generate id that
	 *              can't collide with other event.
	 * @param options
	 *            {Hash}
	 */
	var Cuid = function(options) {
		options = options || {};
		Cuid.prefix = 'shojs-';
		this.id = null;
		this.init(options);
	};

	Cuid.prototype.init = function(options) {
		if (!('count' in Cuid)) {
			Cuid.count = 0;
			Cuid.prefix = (options.prefix || 'shojs') + '-';
			Cuid.postfix = (options.postfix || 'graphit');
		}
	};
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
	 * @param maxtry
	 *            {Int}
	 * @return {String} UID string
	 */
	Cuid.prototype.get = function(maxtry) {
		if (maxtry == undefined) {
			maxtry = 3;
		}
		var str = Cuid.prefix;
		for ( var i = 0; i < 2; i++) {
			str += this.__get_frag() + '-';
		}
		str += Cuid.postfix;
		Cuid.count++;
		Cuid.last_id = str;
		return str;
	};
	Cuid.prototype['get'] = Cuid.prototype.get;

	/**
	 * Method __test
	 * Graphit[js/lib/Cuid.js]
	 * sho / 12 déc. 2012 / 10:00:02
	 */
	Cuid.prototype.__test = function() {
		var Cuid = getBird('Cuid');
		var g = new Cuid();
		console.log('Testing uid', g.get());
		return true;
	};

	Cuid.prototype['__test'] = Cuid.prototype.__test;
	/**
	 * 
	 * Implicit, we dont want to loose ref during ADVANCED_OPTIMIZATIONS
	 */
	$Graphit['_class_pool']['Cuid'] = Cuid;
})(window, graphit);
