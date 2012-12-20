/**
 * Module app/ui/toolbox graphit[js/app/ui/toolbox.js] sho / 17 déc. 2012 /
 * 20:37:43
 */
(function(window, project, console, undefined) {

	'use strict';

	var DEBUG = project.debug;
	var modulePath = 'app/ui/toolbox';

	var Cobject = project.import('lib/widget');

	/**
	 * graphit[js/app/ui/toolbox.js] sho / 17 déc. 2012 / 20:37:43
	 * 
	 * @constructor
	 * @param options
	 *            {Hash} Options hash
	 */
	var Module = function(options) {
		var that = this;
		options = options || {};
		options['className'] = modulePath;
		options['label'] = 'widget_toolbox';
		Cobject.call(this, options);
		this.bind_trigger(this, 'tool_selected', function(e, d) {
			console.log("Tool selected", e, d, that);
			that.select_tool(d, e);
		});
	};

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * Method init graphit[js/app/ui/toolbox.js] sho / 18 déc. 2012 / 06:54:27
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Module.prototype.init = function(options) {
		this.set('width', 200);
		var Ccontent = project.import('lib/ui/content');
		var tools = new Ccontent({
			'label' : 'toolbox_tools'
		});
		this.__populate_tools(tools);
		this.content.add_child(tools);

		var preview = new Ccontent({
			'label' : 'toolbox_preview'
		});
		preview.set_content($('<h4>Toolbox preview</h4>'));
		preview.visible(true);
		this.content.add_child(preview);

		var colors = new Ccontent({
			'label' : 'toolbox_colors'
		});
		colors.set_content($('<h4>Toolbox color</h4>'));
		// colors.visible(false)
		this.content.add_child(colors);

		var options = new Ccontent({
			'label' : 'toolbox_options'
		});
		options.set_content($('<h4>Toolbox options</h4>'));
		// options.visible(false);
		this.content.add_child(options);
		this.dom_get();
		this.refresh();
		console.log('Toolbox', this);
	};

	Module.prototype.refresh = function() {
		var Content = this.content.get_child({
			label : 'toolbox_options'
		});
		var Elm = this.rootElm.find('#' + Content.get_dom_id());
		Elm.children().detach();

		Content = this.content.get_child({
			label : 'toolbox_preview'
		});
		Elm = this.rootElm.find('#' + Content.get_dom_id());
		Elm.children().detach();

		Content = this.content.get_child({
			label : 'toolbox_colors'
		});
		Elm = this.rootElm.find('#' + Content.get_dom_id());
		Elm.children().detach();

		// this.dom_build();
		console.log('Refreshing ', this.label);
		var contentElm = this.rootElm.find('.group-widget-content');
		// contentElm.empty();
		this.content.refresh();
		contentElm.append(this.content.dom_get());
		return this;
	};

	/**
	 * Method __populate_tools graphit[js/app/ui/toolbox.js] sho / 18 déc. 2012 /
	 * 22:06:23
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Module.prototype.__populate_tools = function(content) {
		this.tools = [];
		// content.empty();
		var finalContent = $('<span />');
		var lTools = project.find('app/tool/(.*)');
		for ( var i = 0; i < lTools.length; i++) {
			var tool = new lTools[i]({
				parent : this
			});
			var dom = tool.dom_get();
			// $('body').append(dom);
			// dom.click(function() { console.log('tada')});
			content.rootElm.append(dom);
			// content.add_child(lTools);
			this.tools.push(tool);
		}
		// $('body').append(finalContent);
		content.set_content(finalContent);
	};

	/**
	 * Method get_content graphit[js/app/ui/toolbox.js] sho / 17 déc. 2012 /
	 * 20:38:28
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Module.prototype.get = function(params) {
		return this.content.get(params);
	};

	/**
	 * Method __populate_options graphit[js/app/ui/toolbox.js] sho / 20 déc.
	 * 2012 / 07:30:11
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Module.prototype.__populate_options = function(cTool) {
		console.log('Populate options');
		var count = 0;
		var finalContent = $('<span />');
		var Content = this.content.get_child({
			label : 'toolbox_options'
		});
		for ( var label in cTool.parameters) {
			finalContent.append(cTool.parameters[label].dom_get());
			console.log('Label', label);
			count++;
		}
		if (count > 0) {
			Content.set_content(finalContent);
			Content.visible(true);
		} else {
			Content.set_content($('<span />'));
			Content.visible(false);
		}
		this.refresh();
	};

	/**
	 * Method __populate_preview
	 * graphit[js/app/ui/toolbox.js]
	 * sho / 20 déc. 2012 / 08:27:40
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.__populate_preview = function(cTool) {
		
	};

	/**
	 * Method __populate_colors
	 * graphit[js/app/ui/toolbox.js]
	 * sho / 20 déc. 2012 / 08:27:40
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.__populate_colors = function(cTool) {
		
	};

	/**
	 * Method select_tool graphit[js/app/ui/toolbox.js] sho / 20 déc. 2012 /
	 * 07:25:50
	 * 
	 * @param dumbopt
	 *            {String} dumbstring
	 */
	Module.prototype.select_tool = function(cTool) {
		console.log('Toolbox selecting tool', cTool.label);
		this.__populate_preview(cTool);
		this.__populate_colors(cTool);
		this.__populate_options(cTool);
	};

	/**
	 * Test
	 */
	Module.prototype.__test = function() {
		var M = project.import(modulePath);
		var m = new M();
		m.show();
	};

	/* Export */
	project.export(modulePath, Module);

})(window, graphit, console);
