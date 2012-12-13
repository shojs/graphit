(function(window, graphit, console, undefined) {
	
	'use strict';
	
	/**
	 * Imports
	 */
	var Cparameter = graphit.import('Cparameter');
	
	/**
	 * A select parameter
	 * @constructor
	 * @param options {Hash} 
	 */
	var Cparameter_select = function(options) {
		options = options || {};
		options['className'] = 'Cparameter_select';
		options['parent'] = options['parent'] || { 'className': 'fakeClassName', 'label': 'fakeLabel' }
		options['autoSave'] = ('autoSave' in options && !options['autoSave']) ? false
				: true;
		Cparameter.call(this, options, ['autoSave', 'def', 'label', 'type',
				'choices']);
		this['type'] = this['Etype'].select;
	};

	Cparameter_select.prototype = Object.create(Cparameter.prototype);
	Cparameter_select.prototype.constructor = new Cparameter();

	/**
	 * @param options
	 */
	Cparameter_select.prototype.init = function(options) {
		this['choices'] = {};
		this['def'] = options['def'];
		this['label'] = options['label'];
		this['type'] = options['type'];
		for (label in options['choices']) {
			console.log('Setting choices', label);
			this['choices'][label] = options['choices'][label];
		}
	};
	Cparameter_select.prototype['init'] = Cparameter_select.prototype.init;

	/*
	 * Calle by parent class when setting parameter value
	 */
	// Cparameter_select.prototype._set = function(value) {
	// return value;
	// };
	/**
	 * Build our html element
	 * 
	 * @returns {Cparameter_select}
	 */
	Cparameter_select.prototype.dom_build = function() {
	    	this.rootElm = this['rootElm'];
		this.label = this['label'];
		this.choices = this['choices'];
		var that = this;
		var r = $('<div title="'+this['className']+'">');
		r.addClass('selected parameter');
		r.append('<h6>' + this.label + '</h6>');
		var s = $('<select />');
		for (var c in this.choices) {
			console.log('Option', this.choices[c]);
			var o = $('<option/>');
			o.attr('value', this.choices[c]);
			if (this.value == this.choices[c]) {
				o.attr('selected', 'selected');
			}
			o.append(document.createTextNode(this.choices[c]));
			s.append(o);
		}
		s.change(function() {
			that.set(this.value);
			that['rootElm'].find('option').each(function() {
				var e = $(this);
				// e.attr('selected', false);
			});
			// $(this).attr('selected', true);
			if ('callback_change' in that) {
				that.callback_change.call(that, this.value);
			}
		});
		r.append(s);
		this['rootElm'] = r;
		return this;
	};
	Cparameter_select.prototype['dom_build'] = Cparameter_select.prototype.dom_build;

	/**
	 * Method __test Graphit[js/lib/parameters/Cparameter_select.js] sho / 12
	 * déc. 2012 / 13:26:59
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Cparameter_select.prototype.__test = function(dumbopt) {
		var Cparameter_select = graphit.import('Cparameter_select');
		var parent = { 'className': this['className'], 'label': this['label'], 'parent': this };
		var p = new Cparameter_select({
			'parent': parent,
			'label' : 'Test parameter select',
			'def' : 'test01',
			'choices' : [
					'test01', 'test02', 'test03'
			]
		});
		var dom = p.dom_get();
		widget_factory(dom);// .dialog('open');
		return true;
	};
	Cparameter_select.prototype['__test'] = Cparameter_select.prototype.__test;

	// Export
	graphit.export('Cparameter_select', Cparameter_select);

})(window, graphit, console);
