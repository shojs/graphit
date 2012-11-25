function Cexception_message(opt) {
	/*
	 * EXCEPTION DATA (GLOBAL)
	 */
	EXCEPTION = {
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
	this.type = 'shojs-exception';
	this.className = opt.className;
	this.label = opt.label;
	this.additional = opt.additional;
	this.object = opt.object;
	this.original = opt.original;
	if (this.className in EXCEPTION && label in EXCEPTION[this.className]) {
		this.message = EXCEPTION[this.className][label];
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
		str += label + ': ' + this[label] + nl;
	}
	return str;
};


