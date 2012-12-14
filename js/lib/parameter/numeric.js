(function(window, graphit, console, undefined) {

	'use strict';

	var modulePath = 'lib/parameter/numeric';
	
	var Cparameter = graphit.import('lib/parameter');
	var Etype = graphit.import('lib/parameter/enum/type');
	
	/**
	 * Class Module graphit[js/lib/parameters/Module.js]
	 * sho / 13 déc. 2012 / 03:38:07
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */

	var Module = function(options) {
		options.type = Etype.numeric;
		options.className = modulePath;
		options.autoSave = ('autoSave' in options && !options.autoSave) ? false
				: true;
		Cparameter.call(this, options);
		return this;
	}

	Module.prototype = Object.create(Cparameter.prototype);
	Module.prototype.constructor = new Cparameter();

	Module.prototype.init = function(options) {
		this.checks = new Object({
			label : 1,
			min : 1,
			max : 1,
			def : 1,
			step : 1
		});
		for (k in this.checks) {
			if (!(k in options) || options[k] === undefined) {
				console.error('Missing parameter key/value', options, k);
				return null;
			}
			if (k == 'label') {
				this[k] = options[k];
			} else {
				this[k] = parseFloat(options[k]);
			}
		}
	};

	Module.prototype._get = function(v) {
		return parseFloat(v);
	};

	Module.prototype._set = function(v) {
		return parseFloat(v);
	};

	Module.prototype.dom_build = function() {
		var that = this;
		var r = $('<div />');
		r.addClass('sliderex parameter ' + this.label);
		r.attr('title', this.label);
		var table = $('<table />');
		var tr = $('<tr />');
		var td = $('<td />');
		td.append('<h6>' + this.label + '</h6>');
		tr.append(td);
		var slider = $('<div />');
		slider.addClass('slider');
		slider.slider({
			min : this.min,
			max : this.max,
			value : this.value,
			step : this.step,
			slide : function() {
				var t = $(this);
				var value = t.slider('option', 'value');
				that.set(value);
				var p = t.parents('.sliderex').find('input.input');
				p.attr('value', value);
				if ('callback_slide' in that) {
					that.callback_slide.call(that, value);
				}
			},
			change : function() {
				var t = $(this);
				var value = t.slider('option', 'value');
				that.set(value);
				var p = t.parents('.sliderex').find('input.input');
				p.attr('value', value);
				if ('callback_change' in that) {
					that.callback_change.call(that, value);
				}
			}
		});
		td = $('<td />');
		td.append(slider);
		tr.append(td);
		var input = $('<input />');
		input.addClass('input');
		input.attr('value', this.value);
		input.css('width: 2em');
		input.change(function() {
			var t = $(this);
			var value = t.attr('value');
			var p = t.parents('.sliderex').find('.slider');
			p.slider('option', 'value', value);
			that.set(value);
			if ('callback_change' in that) {
				that.callback_change.call(that, value);
			}
		});
		input.spinner();
		td = $('<td />');
		td.append(input);
		tr.append(td);
		table.append(tr);
		r.append(table);
		this.rootElm = r;
		return this;
	};
	
	graphit.export(modulePath, Module);
	
})(window, graphit, console);
