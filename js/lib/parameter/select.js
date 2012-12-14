(function(window, graphit, console, undefined) {
	
	'use strict';
	
	var modulePath = 'lib/parameter/select';
	
	var DEBUG = (graphit.debug > 5)? true: false;
	
	/**
	 * Imports
	 */
	var Cparameter = graphit.import('lib/parameter');
	var Etype = graphit.import('lib/parameter/enum/type');
	/**
	 * A select parameter
	 * @constructor
	 * @param options {Hash} 
	 */
	function Module (options) {
		options = options || {};
		options['className'] = modulePath;
		options['parent'] = options['parent'] || { 'className': 'fakeClassName', 'label': 'fakeLabel'};
		console.log('Parent', options['parent']);
		options['autoSave'] = ('autoSave' in options && !options['autoSave']) ? false
				: true;
		Cparameter.call(this, options, ['autoSave', 'def', 'label', 'type',
				'choices', 'parent']);
		this['type'] = Etype.select;
	};

	Module.prototype = Object.create(Cparameter.prototype);
	Module.prototype.constructor = new Cparameter();

	/**
	 * @param options
	 */
	Module.prototype.init = function(options) {
		this['choices'] = {};
		this['def'] = options['def'];
		this['label'] = options['label'];
		this['type'] = options['type'];
		for (var label in options['choices']) {
			this['choices'][label] = options['choices'][label];
		}
	};
	Module.prototype['init'] = Module.prototype.init;

	/*
	 * Calle by parent class when setting parameter value
	 */
	// Module.prototype._set = function(value) {
	// return value;
	// };
	/**
	 * Build our html element
	 * 
	 * @returns {Module}
	 */
	Module.prototype.dom_build = function() {
	    	this.rootElm = this['rootElm'];
		this.label = this['label'];
		this.choices = this['choices'];
		var that = this;
		var r = $('<div title="'+this['className']+'">');
		r.addClass('selected parameter');
		r.append('<h6>' + this.label + '</h6>');
		var s = $('<select />');
		for (var c in this.choices) {
			if (DEBUG) { console.log('Option', this.choices[c]); }
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
	Module.prototype['dom_build'] = Module.prototype.dom_build;

	/**
	 * Method __test Graphit[js/lib/parameters/Module.js] sho / 12
	 * déc. 2012 / 13:26:59
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Module.prototype.__test = function() {
		var M = graphit.import(modulePath);
		var parent = { 'className': modulePath, 'label': modulePath };
		var m = new M({
			'parent': parent,
			'label' : 'Test parameter select',
			'def' : 'test01',
			'choices' : [
					'test01', 'test02', 'test03'
			]
		});
		var dom = m.dom_get();
		widget_factory(dom);// .dialog('open');
		return true;
	};
	Module.prototype['__test'] = Module.prototype.__test;

	// Export
	graphit.export(modulePath, Module);

})(window, graphit, console);
