(function(window, graphit, console, undefined) {

	'use strict';

	var DEBUG = (graphit.debug > 10)? true: false;
	
	var modulePath = 'lib/parameter/checkbox';
	
	var Cparameter = graphit.import('lib/parameter');
	var Etype = graphit.import('lib/parameter/enum/type');
	/**
	 * Class Module
	 * graphit[js/lib/parameters/Module.js] sho / 13 déc. 2012 /
	 * 03:36:07
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */

	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.label = 'checkbox';
		options.autoSave = ('autoSave' in options && !options.autoSave) ? false
				: true;
		Cparameter.call(this, options);
		this.type = Etype.checkbox;
	}

	Module.prototype = Object.create(Cparameter.prototype);
	Module.prototype.constructor = new Cparameter();

	Module.prototype.init = function(options) {
		this.choices = {};

	};

	/**
	 * @param value
	 * @returns {Boolean}
	 */
	Module.prototype._get = function(value) {
		if (value == 'true') return true;
		else if (value == 'false') return false;
		else if (value) return true;
		else
			return false;
	};

	/**
	 * @param v
	 */
	Module.prototype._set = function(v) {
		if (v == 'false' || !v) {
			v = false;
		} else {
			v = true;
		}
		if (v) {
			if (this.rootElm) {
				this.rootElm.find('input').attr('checked', 'checked');
			}
		} else {
			this.value = false;
			if (this.rootElm) {
				this.rootElm.find('input').removeAttr('checked');
			}
		}
		return v;
	};

	/**
	 * @returns {Cparameter}
	 */
	Module.prototype.dom_build = function() {
		var that = this;
		var r = $('<div />');
		r.addClass('selectex parameter');
		r.append('<h6>' + this.label + '</h6>');
		var s = $('<input />');
		s.attr('type', 'checkbox');
		s.attr('title', label);
		if (this.value) {
			s[0].checked = 'checked';
		}
		s.change(function() {
			that.set(this.checked);
			if ('callback_change' in that) {
				that.callback_change.call(that, s[0].checked);
			}
		});
		r.append(s);
		this.rootElm = r;
		return that;
	};

	/**
	 * Method __test
	 * graphit[js/lib/parameters/Module.js]
	 * sho / 13 déc. 2012 / 22:45:41
	 */
	Module.prototype.__test = function() {
		if (DEBUG) {
			console.log('Overide Cparameter test ...');
		}
	};
	
	graphit.export(modulePath, Module);
	
})(window, graphit, console);
