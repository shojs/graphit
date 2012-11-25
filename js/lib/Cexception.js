function Cexception_message(opt) {
	/*
	 * EXCEPTION DATA (GLOBAL)
	 */
	Cexception_message.EXCEPTION = {
		_ALL: {
			method_object_missing: "This object doesn't have the required method (See additional)"
		},
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
		Ctool: {
			no_size_parameter: "Each tool require a size Cparameter"
		},
		
	};
	var E = Cexception_message.EXCEPTION;
	this.type = 'shojs-exception';
	this.className = opt.className;
	this.label = opt.label;
	this.additional = opt.additional;
	this.object = opt.object;
	this.original = opt.original;
	this.message = null;
	if (this.className in E && this.label in E[this.className]) {
		this.message = E[this.className][this.label];
	}
	if (!this.message && this.label in E['_ALL']) {
		this.message = E['_ALL'][this.label];
	}
}

/**
 *
 */
Cexception_message.prototype.to_s = function(opt) {
	var nl = "\n";
	if (opt != undefined && 'format' in opt) {
		if (opt.format == 'html') {
			nl = '<br>' + nl;
		}
	}
	var str = '[' + this.type + ']' + nl + nl;
	for (label in this) {
		if (!this.hasOwnProperty(label)) {
			continue;
		}
		if (typeof this[label] == 'object' && this[label]) {
			str += label + ': ' + this[label].toString() + nl;
		} else {
			str += label + ': ' + this[label] + nl;
		}
	}
	return str;
};


