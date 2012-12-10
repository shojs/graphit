/**
 * Generate Unique ID. Main usage of this uid is for binding element together
 * with triggered event. We generate id that can't collide with other event.
 * 
 * @param options
 *            {Hash}
 */
function Cuid(options) {
	options = options || {};
	Cuid.prefix = 'shojs-';
	this.id = null;
	this.init(options);
}

Cuid.prototype.init = function(options) {
	if (!('count' in Cuid)) {
		Cuid.count = 0;
		Cuid.prefix = (options.prefix || 'shojs') + '-';
		Cuid.postfix = (options.postfix || 'graphit');
	}
};

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
