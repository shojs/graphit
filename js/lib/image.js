(function(window, graphit, $, console, undefined) {
	
	'use strict';
	
	var modulePath = 'lib/image';
	var Cobject = graphit.import('lib/object');
	var Estatus = graphit.import('lib/enum/loading');
	
	/**
	 * @constructor A html image element
	 * @param options
	 *            Cobject hash arguments
	 * @return {Module} Module instance
	 */
	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.label = options.label || 'image';
		Cobject.call(this, options, [
				'parent', 'src', 'width', 'height', 'title',
		]);
		this.options = options;
		this.data = null;
		this.status = Estatus.none;
		this.errorMsg = '';
		this.last_update = null;
		if (!this.src) {
			console.warn(this.className + ' constructed without src argument');
		}
		this.dom_get();
	}

	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * Build our DOM element, storing it in this.rootElm
	 * 
	 * @return {Module} This
	 */
	Module.prototype.dom_build = function() {
		var that = this;
		var img = $('<img />');
		img.attr('data-po_label', this.label);
		img.addClass(this.get_dom_class());
		img.on('load', function() {
			return that.__callback_onload.call(that);
		});
		img.on('error', function() {
			return that.__callback_onerror.call(that);
		});
		img.on('click', function(e) {
			e.stopPropagation();
			that.__callback_click.call(that);
			return false;
		});
		// console.log(opt);
		if ('label' in this && this.label != undefined) {
			img.attr('alt', this.label);
			img.attr('title', this.label);
		}
		if ('width' in this && this.width != undefined) {
			img.attr('width', this.width);
		}
		if ('height' in this && this.height != undefined) {
			img.attr('height', this.height);
		}
		if ('src' in this && this.src) {
			img.attr('src', this.src);
		}
		this.rootElm = img;
		return this;
	};

	/**
	 * @private
	 * @returns {Boolean}
	 */
	Module.prototype.__callback_onload = function() {
		console.log('Image loaded');
		this.status = Estatus.ok;
		this.last_update = Date.now();
		if ('replace_id' in this.options && this.options.replace_id) {
			var e = document.getElementById(this.options.replace_id);
			if (!e) {
				this.errorMsg = 'Replacing image failed';
				ret = false;
			} else {
				if ('label' in this.options) {
					e.setAttribute('alt');
				}
				e.width = this.data.width;
				e.height = this.data.height;
				e.src = this.data.src;
			}
		}
		var callback = this.callback_exists('success');
		if (callback) {
			return callback.call(this);
		}
		return true;
	};

	/**
	 * @private
	 * @returns {Boolean}
	 */
	Module.prototype.__callback_onerror = function() {
		this.status = Estatus.fail;
		this.last_update = null;
		var callback = this.callback_exists('error');
		if (callback) {
			return callback.call(this);
		}
		return true;
	};

	/**
	 * @private 
	 * @returns {Boolean}
	 */
	Module.prototype.__callback_click = function() {
		console.log('Callback click', this.label);
		var callback = this.callback_exists('click');
		if (callback) {
			return callback.call(this);
		}
		return true;
	};
	
	/**
	 * Method __test
	 * graphit[js/lib/Module.js]
	 * sho / 13 déc. 2012 / 22:58:51
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.__test = function(dumbopt) {
		console.log('Overide Cobject.__test');
		return true;
	};
	
	graphit.export(modulePath, Module);

})(window, graphit, jQuery, console);
