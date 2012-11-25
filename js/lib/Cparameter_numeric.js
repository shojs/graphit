/**
 * 
 * @param options
 */
function Cparameter_numeric(options) {
    options.type = Eparameter_type.numeric;
    Cparameter.call(this, options);
    return this;
}

Cparameter_numeric.prototype = Object.create(Cparameter.prototype);
Cparameter_numeric.prototype.constructor = new Cparameter();

Cparameter_numeric.prototype.init = function(options) {
	this.checks = new Object({ label: 1, min: 1, max: 1, def: 1, step: 1});
	for (k in this.checks) {
		if (!(k in options) || options[k] === undefined) {
			console.error('Missing parameter key/value', options, k);
			return null;
		}
		if (k == 'label') { this[k] = options[k]; }
		else { this[k] = parseFloat(options[k]); }
	}
};

Cparameter_numeric.prototype._get = function(v) {
    return parseFloat(v);
};

Cparameter_numeric.prototype._set = function(v) {
	return parseFloat(v);
};

Cparameter_numeric.prototype.dom_build = function() {
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

