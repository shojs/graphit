(function(window, graphit, console, undefined) {

	var modulePath = 'app/brush/enum/type';

	var Module = function() {
		var myenum = {
			'js' : 1,
			'gbr' : 2
		};
		for ( var label in myenum) {
			this[label] = myenum[label];
		}
	};

	/**
	 * Method key_by_value graphit[js/app/brush/enum/type.js] sho / 14 déc. 2012 /
	 * 11:16:56
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Module.prototype.key_by_value = function(value) {
		for ( var key in this['enum']) {
			if (this['enum'][key] == value) return key;
		}
		return null;
	};
	Module.prototype['key_by_value'] = Module.prototype.key_by_value;

	console.log(modulePath, Module);
	graphit.export(modulePath, new Module());

})(window, graphit, console);
