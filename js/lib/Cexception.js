/**
 * Class  Cexception
 * 21:46:42 / 23 nov. 2012 [jsgraph] sho 
 */
function Cexception(data) {
	this.data = data;
}

/* Inheritance */
//Cexception.prototype = Object.create(Cobject.prototype);
//Cexception.prototype.constructor = new Cobject();

/**
 *
 */
Cexception.prototype.deliver = function(cname, label) {
	var msg = '';
	if (!(cname in this.data)) {
		msg = 'Invalid exception no data for class <<' + cname + '>>';
		//console.error(msg);
		throw msg;
	}
	if (!(label in this.data[cname])) {
		msg = 'Invalid exception no label <<' +  label 
			+  '>> in class data <<' + cname + '>>';
		//console.error(msg);
		throw msg;
	}
	throw(this.data[cname][label]);
};


var cE = new Cexception({
	Csurface: {
		invalid_width: "The specified width is invalid 0 < width < 1920",
		invalid_height: "The specified height is invalid 0 < height < 1920",
	},
});