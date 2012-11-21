/**
 * 11 All
 * 5 Verbose
 * 1 Normal
 */
var SHOJS_DEBUG = 1;

function Cuid() {
    this.prefix = 'sho';
    this.id = null;
    this.stats = {
	count: { label: 'Number of UID generated', type: 'int' , value: 0 }    
    };
    this.init();
}

Cuid.prototype.get_frag = function() {
    var max = 65535;
    var i = Math.round(Math.random() * Date.now() / (max * 10));
    var txt = i + '';
    i = parseInt(txt.slice(0, 5));
    return helper_format_number_length(i, 5);
};

Cuid.prototype.get = function(maxtry) {;
    this.stats.count.value++;
    if (maxtry == undefined) {
	maxtry == 3;
    }
    var str = this.prefix + '-';
    for ( var i = 0; i < 4; i++) {
	str += this.get_frag() + '-';
    }
    str += 'uid';
    var e = document.getElementById(str);
    if (e) {
	console.error('UID already present in dom');
	maxtry--;
	if (maxtry >= 0) {
	    return this.get(maxtry);
	}
	console.error('Cannot make unique uid... aborting!');
	return 'UID_ERROR';
    }
    return str;
};

Cuid.prototype.init = function() {
    this.id = this.get();
};

var UID = new Cuid();

/*******************************************************************************
 * 
 * @returns
 */
function Cdraw_glob() {
    this.graphing_interval = 5;
};

var DRAWGLOB = new Cdraw_glob();
