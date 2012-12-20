(function(window, graphit, console, undefined) {

	'use strict';
	
	var modulePath = 'lib/menu';
	
	var Cobject = graphit.import('lib/object');
	
	/**
	 * @constructor Class Module 06:40:06 / 24 nov. 2012 [jsgraph] sho
	 */
	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.label = options.label || "menu";
		options.type = options.type || 'jquery';
		this.entries = {};
		this.num_child = 0;
		Cobject.call(this, options, [
				'type', 'parent', 'cssClass'
		]);
	}

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 *
	 */
	Module.prototype.init = function(options) {
		for ( var label in options.entries) {
			options.entries[label].parent = this;
			options.entries[label].type = this.type;
			this.add(new Module(options.entries[label]));
		}
	};
	/**
	 *
	 */
	Module.prototype.exists = function(cMenu) {
		if (cMenu.label in this.entries) {
			return true;
		}
		return false;
	};
	/**
	 *
	 */
	Module.prototype.add = function(cMenu) {
		if (!cMenu || !(cMenu instanceof Module)) {
			this.exception('invalid_menu_entry', cMenu);
		}
		if (this.exists(cMenu)) {
			this.exception('label_already_present', cMenu.label);
		}
		this.entries[cMenu.label] = cMenu;
		this.num_child++;
	};

	/**
	 * #TODO This dom_build is the ugliest one, well one of the less pretty ...
	 */
	Module.prototype.dom_build = function() {
		var r;
		if (parent in this && this.parent instanceof Module) {
			r = this.parent.rootElm;
		} else {
			r = $('<ul />');
		}
		for ( var label in this.entries) {
			var cEntry = this.entries[label];
			var a = $('<a href="#" title=""/>');
			a.attr('label', label);
			if ('click' in cEntry.callback) {
				cEntry.install_callback(a);
			}
			var c = $('<li />');
			var txt = $('<span>' + label + '</span>');
			txt.addClass('menu-entry');
			if (this.cssClass) txt.addClass(this.cssClass);
			a.append(txt);
			c.append(a);
			if (cEntry.has_child()) {
				var e = cEntry.dom_get({
					noHeader : true
				});
				c.append(e);
			}
			r.append(c);
		}
		if (this.type == 'jquery'
				&& (!this.parent || !(this.parent instanceof Module))) {
			r.menu({
				role : 'listbox'
			});
			r.menu('enable');
		}
		if (!this.parent || !(this.parent instanceof Module)) {
			var f = $('<div />');
			f.append(r);
			r = f;
		}

		this.rootElm = r;
		return this;
	};

	/**
	 *
	 */
	Module.prototype.has_child = function() {
		if (this.num_child > 0) {
			return true;
		}
		return false;
	};

	/**
	 *
	 */
	Module.prototype.install_callback = function(elm) {
		var that = this;
		elm.click(function() {
			that.callback.click();
		});
	};

	/**
	 *
	 */
	Module.prototype.count_childs = function() {
		var i = 0;
		for (c in this.entries) {
			// if (this.entries.hasOwnProperty(c))
			// { continue;}
			i++;
		}
		return i;
	};

	graphit.export(modulePath, Module);
	
})(window, graphit, console);
