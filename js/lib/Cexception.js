/**
 * Class  Cexception
 * We are throwing all our exception via a singleton... yeah, yeah not a real
 * singleton :)
 * 
 * 21:46:42 / 23 nov. 2012 [jsgraph] sho 
 */
function Cexception(data) {
	this.data = data;
}


/**
 * Delivering our exception
 */
Cexception.prototype.deliver = function(object, label, pmsg) {
	console.error(this, object, label, pmsg);
	var e = {
			type: 'shojs-exception',
			className: object.className,
			label: label,
			additional: pmsg,
			object: object
	};
	if (!e.object) {
		e.error = "No object";
	}
	if (!(e.className in this.data)) {
		msg = 'Invalid exception no data for class <<' + e.className + '>>';
		e.error = msg;
		throw e;
	} else if (!(label in this.data[e.className])) {
		msg = 'Invalid exception no label <<' +  label 
			+  '>> in class data << ' + e.className + ' >>';
		e.error = msg;
		throw e;
	}
	e.message = '[' + e.className + '/' + label + '] ' + this.data[e.className][label];
	throw e;
};


/*
 * EXCEPTION DATA (GLOBAL)
 */
var SHOJS_EXCEPTION = new Cexception({
	Csurface: {
		invalid_width: "The specified width is invalid 0 < width < 1920",
		invalid_height: "The specified height is invalid 0 < height < 1920"
	},
	Ccanvas: {
		invalid_width: "The specified width is invalid 0 < width < 1920",
		invalid_height: "The specified height is invalid 0 < height < 1920",
		invalid_copy_source: "You're trying to copy something that is not a Ccanvas or who is null"
	},
	Cmenu: {
		invalid_menu_entry: "Your are trying to add non Cmenu_entry object",
		label_already_present: "Label already set in this menu"
	},
});