/**
 * Module app/widget graphit[js/app/widget.js] sho / 17 déc. 2012 / 02:22:16
 */
(function(window, project, console, undefined) {

	'use strict';

	var DEBUG = project.debug;
	var modulePath = 'lib/widget';

	var Cobject = project.import('lib/object');
	var PO = new (graphit.import('lib/po'))();
	var T = function(key) {
		return PO.get(key);
	};

	var authorized_keys = {
		'autoOpen' : 1,
		'buttons' : 1,
		'closeOnEscape' : 1,
		'closeText' : 1,
		'dialogClass' : 1,
		'draggable' : 1,
		'height' : 1,
		'hide' : 1,
		'maxHeight' : 1,
		'maxWidth' : 1,
		'minHeight' : 1,
		'minWidth' : 1,
		'modal' : 1,
		'position' : 1,
		'resizable' : 1,
		'show' : 1,
		'stack' : 1,
		'title' : 1,
		'width' : 1,
		'zIndex' : 1
	};
	/**
	 * graphit[js/app/widget.js] sho / 17 déc. 2012 / 02:22:16
	 * 
	 * @constructor
	 * @param options
	 *            {Hash} Options hash
	 */
	var Module = function(options) {
		options = (options)? options: {};
		options['className'] = options.className || modulePath;
		options['label'] = options['label'] || modulePath;
		options['options'] = {};
		options.content = new (project.import('lib/ui/content'))({'label': 'main_content'});
		Cobject.call(this, options, ['label', 'content', 'options']);
		this.dom_get();
	};

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * Method init
	 * graphit[js/lib/widget.js]
	 * sho / 18 déc. 2012 / 07:18:25
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.init = function(dumbopt) {
		this.dom_get({force: true});
	};
	
	/**
	 * Method set graphit[js/app/widget.js] sho / 17 déc. 2012 / 02:47:07
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Module.prototype.set = function(key, value) {
		if (!(key in authorized_keys)) {
			this.exception('unauthorized_key', key);
		}
		this.options[key] = value;
	};
	
	/**
	 * Method get graphit[js/app/widget.js] sho / 17 déc. 2012 / 02:48:40
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Module.prototype.get = function(key) {
		if (!(key in authorized_keys)) {
			this.exception('unauthorized_key', key);
		}
		return this.options[key];
	};
	

	/**
	 * Method dom_build graphit[js/app/widget.js] sho / 17 déc. 2012 / 02:40:03
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Module.prototype.dom_build = function() {
		var widget = $('<div />');
		widget.attr('id', this.get_dom_id());
		widget.attr('title', this.label);
		var content = $('<span />');
		if (content) {
			content.addClass('group group-widget-content');
			widget.append(content);
		}
		this.rootElm = widget;
		return this;
	};
	
	/**
	 * Method set_content graphit[js/app/widget.js] sho / 17 déc. 2012 /
	 * 02:54:23
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Module.prototype.add_content = function(content) {
		this.content.add_child(content);		
		this.refresh();
	};
	
	/**
	 * Method get_content graphit[js/app/widget.js] sho / 17 déc. 2012 /
	 * 03:00:18
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
//	Module.prototype.get_content = function() {
//		return this.content;
//	};

	/**
	 * Method refresh Reload our widget content and title
	 * graphit[js/app/widget.js] sho / 17 déc. 2012 / 03:01:03
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Module.prototype.refresh = function() {
		//this.dom_build();
		console.log('Refreshing ', this.label);
		var contentElm = this.rootElm.find('.group-widget-content');
		contentElm.empty();
		this.content.refresh();
		contentElm.append(this.content.dom_get());
		return this;
	};
	
	/**
	 * Method show
	 * graphit[js/lib/widget.js]
	 * sho / 17 déc. 2012 / 23:19:08
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.show = function(options) {
		options = options || this.options;
		console.log('Options', options);
		this._dialog = this.dom_get().dialog(this.options).dialog('open');
	};
	
	/**
	 * Method hide
	 * graphit[js/lib/widget.js]
	 * sho / 17 déc. 2012 / 23:19:49
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.hide = function() {
		if (!this._dialog) return false;
		this._dialog.dialog('close');
		return true;
	};
	
	/**
	 * Test
	 */
	Module.prototype.__test = function() {
		console.log('Testing widget');
		var M = project.import(modulePath);
		var m = new M({
			label : 'TEST_test'
		});
		m.set('autoOpen', true);
		m.set('width', 200);
		m.set('height', 200);
		m.set_content('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac felis dui, sodales mattis urna. In eros quam, tristique et varius at, faucibus ac sapien. Aenean vel augue eu tortor pretium sollicitudin. In tristique ipsum volutpat lectus tempor ut pulvinar massa ultrices. Donec tincidunt dui vitae leo fringilla tristique. Nulla tempor enim in lacus faucibus non laoreet elit pretium. Donec eget dapibus diam. Vivamus adipiscing iaculis mauris ultrices convallis. Nunc ultrices nibh euismod arcu fringilla a semper nulla sollicitudin. Curabitur commodo libero felis. Vivamus facilisis leo id felis molestie varius tempus erat dignissim. Praesent aliquam, urna ac dictum commodo, augue est rhoncus nisi, eu ultricies diam purus vitae mauris. Curabitur in lectus enim.');
		PO.set_lang('fr');
		m.refresh();
		m.show();
	};
	
	/* Export */
	project.export(modulePath, Module);

})(window, graphit, console);
