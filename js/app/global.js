var SHOJS_DEBUG = 5;

function Cuid() {
	this.num_created = 0;
	this.prefix = 'sho';
	this.id = null;
	this.init();
}

Cuid.prototype.get_frag = function() {
	var max = 65535;
	var i = Math.round(Math.random()*Date.now()/(max*10));
	var txt = i + '';
	i = parseInt(txt.slice(0,5));
	return helper_format_number_length(i, 5);
};

Cuid.prototype.get = function() {
	var str = this.prefix + '-';
	for (var i = 0; i < 4; i++) {
		str += this.get_frag() + '-';
	}
	str += 'uid';
	this.num_created++;
	//console.log(this.num_created, 'Created UID', str);
	return str;
};

Cuid.prototype.init = function() {
	this.id = this.get();
	//console.log('id: ' + this.id);
};

var UID = new Cuid();




/******************************************************************************
 * 
 * @returns
 */
function Cdraw_glob() {
	this.graphing_interval = 5;
};

var DRAWGLOB = new Cdraw_glob();
