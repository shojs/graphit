(function(window, graphit, console) {
	
	'use strict';
	
	var DEBUG = (graphit.debug >= 10)? true: false;
	
	var modulePath = 'lib/exception';
	
	/**
	 * @constructor
	 * @param opt
	 */
	var Module = function(opt) {
		opt = opt || {};
		/*
		 * EXCEPTION DATA (GLOBAL)
		 */
		this.EXCEPTION = {
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
		this['className'] = opt.className || modulePath;
		this['label'] = opt.label;
		this['additional'] = opt.additional;
		this['object'] = opt.object;
		this['original'] = opt.original;
		this.message = null;
		if (this.className in this.EXCEPTION && this.label in this.EXCEPTION[this.className]) {
			this.message = this.EXCEPTION[this.className][this.label];
		}
		if (!this.message && this.label in this.EXCEPTION['_ALL']) {
			this.message = this.EXCEPTION['_ALL'][this.label];
		}
	};
	
	/**
	 * Method __test
	 * graphit[js/lib/Module.js]
	 * sho / 13 déc. 2012 / 02:22:22
	 */
	Module.prototype.__test = function() {
		var e = new (graphit.import(modulePath))('TEST_EXCEPTION');
		try { throw e; } catch(e) { if (DEBUG) console.log(e.to_s());}
		return true;
	};
	
	/**
	 *
	 */
	Module.prototype.to_s = function(opt) {
		var nl = "\n";
		if (opt != undefined && 'format' in opt) {
			if (opt.format == 'html') {
				nl = '<br>' + nl;
			}
		}
		var str = '[' + this.type + ']' + nl + nl;
		for (var label in this) {
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
	
	graphit.export(modulePath, Module);
	
})(window, graphit, console);
