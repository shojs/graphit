(function(window, graphit, console) {
	/**
	 * @constructor
	 * @param opt
	 * @returns
	 */
	function Cexception_message(opt) {
		opt = opt || {};
		/*
		 * EXCEPTION DATA (GLOBAL)
		 */
		EXCEPTION = {
			'_ALL' : {
				'method_object_missing' : "This object doesn't have the required method (See additional)"
			},
			'Csurface' : {
				'invalid_width' : "The specified width is invalid 0 < width < 1920",
				'invalid_height' : "The specified height is invalid 0 < height < 1920"
			},
			'Ccanvas' : {
				'invalid_width' : "The specified width is invalid 0 < width < 1920",
				'invalid_height' : "The specified height is invalid 0 < height < 1920",
				'invalid_copy_source' : "You're trying to copy something that is not a Ccanvas or who is null"
			},
			'Cmenu' : {
				'invalid_menu_entry' : "Your are trying to add non Cmenu_entry object",
				'label_already_present' : "Label already set in this menu"
			},
			'Ctool' : {
				'no_size_parameter' : "Each tool require a size Cparameter"
			},
		};
		this['type'] = 'shojs-exception';
		this['className'] = opt.className || 'no object';
		this['label'] = opt.label;
		this['additional'] = opt.additional;
		this['object'] = opt.object;
		this['original'] = opt.original;
		this.message = null;
		if (this.className in EXCEPTION && this.label in EXCEPTION[this.className]) {
			this.message = EXCEPTION[this.className][this.label];
		}
		if (!this.message && this.label in EXCEPTION['_ALL']) {
			this.message = EXCEPTION['_ALL'][this.label];
		}
	}
	
	/**
	 * Method __test
	 * graphit[js/lib/Cexception_message.js]
	 * sho / 13 déc. 2012 / 02:22:22
	 */
	Cexception_message.prototype.__test = function() {
		var e = new (graphit.import('Cexception_message'))('TEST_EXCEPTION');
		try { throw e; } catch(e) { console.log(e.to_s());}
		return true;
	};
	Cexception_message.prototype['__test'] = Cexception_message.prototype.__test;
	
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
	Cexception_message.prototype['to_s'] = Cexception_message.prototype.to_s;
	
	graphit.export('Cexception_message', Cexception_message);
})(window, graphit, console);
