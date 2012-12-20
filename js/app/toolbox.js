(function(window, graphit, console, undefined) {

	'use strict';
	
	var modulePath = 'app/toolbox';
	
	/**
	 * Import
	 */
	var Cobject = graphit.import('lib/object');
	var Ctoolbox_preview = graphit.import('app/toolbox/preview');
	var Ctoolbox_colorpicker = graphit.import('app/toolbox/colorPicker');
	var Ctool = graphit.import('app/tool');
	var Ctool_pencil = graphit.import('app/tool/pencil');
	var Ctool_paintbrush = graphit.import('app/tool/paintbrush');
	var Ctool_fill = graphit.import('app/tool/fill');
	var Ctool_eraser = graphit.import('app/tool/eraser');
	var Ctool_color_picker = graphit.import('app/tool/colorPicker');
	var Ccolor = graphit.import('lib/color');
	var Cbrush_manager = graphit.import('app/brush/manager');
	
	var Cicon= graphit.import('lib/icon');
	
	var PO = new(graphit.import('lib/po'))();
	var T = function(key) { return PO.get(key); };
	
	/***************************************************************************
	 * @constructor A class representing our toolbox - list of tools - fg/bg
	 *              colorpicker - options associated with tools - brush preview
	 */
	function Module(options) {
		var that = this;
		options.className = modulePath;
		options.label = 'toolbox';
		Cobject.call(this, options, [
			'parent'
		]);
		this.elmPreview = null;
		this.elmOptions = null;
		this.dialog_options = {
			modal : false,
			width : 250,
			position : 'right top',
			stack : true
		};
		this.bind_trigger(this.fg_color, 'color_selected', function(e, d) {
			if (window.graphit.debug > 4) console.log('[Trigger/received]',
					e.type);
			that.update();
		});
		this.bind_trigger(this.bg_color, 'color_selected', function(e, d) {
			if (window.graphit.debug > 4) console.log('[Trigger/received]',
					e.type);
			that.update();
		});

		this.bind_trigger(this, 'switch_color', function(e, d) {
			that.switch_color();
		});
	}

	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * Auto called by parent class
	 */
	Module.prototype.init = function() {
		var that = this;
		this.selected = null;
		this.tools = new Array();

		/*
		 * BRUSH PREVIEW
		 */
		this.preview = new Ctoolbox_preview({
			parent : this
		});

		/*
		 * Foreground color
		 */
		this.fg_color = new Ctoolbox_colorpicker(new Ccolor({
			r : 255,
			g : 255,
			b : 255,
			a : 1
		}), {
			parent : this,
			callback_onchange : function(rgb) {
				this.send_trigger('update', that);
			},
			label : T('foreground_color')
		});
		this.bind_trigger(this.fg_color, 'update', function(e, d) {
			that.update();
		});
		/*
		 * Background color
		 */
		this.bg_color = new Ctoolbox_colorpicker(new Ccolor({
			r : 0,
			g : 0,
			b : 0,
			a : 1
		}), {
			parent : this,
			callback_onchange : function(rgb) {
				this.send_trigger('update', that);
			},
			label : T('background_color')
		});
		this.bind_trigger(this.bg_color, 'update', function(e, d) {
			that.update();
		});
		/*
		 * Brush manager
		 */
		this.brush_manager = new Cbrush_manager({
			parent : this
		});
		this.bind_trigger(this.brush_manager, 'update', function(e, d) {
			that.update();
		});

		this.load(this.olist);
		this.dom_build();
	};

	/**
	 *
	 */
	Module.prototype.select_tool_by_name = function(name) {
		var that = this;
		return cEach(this.tools, function(i, e) {
			if (e.label == name) {
				that.select_tool(e);
				this.stop();
				this.ret = true;
			}
			return false;
		});
	};

	/**
	 * Load tools from hash
	 * 
	 * @param olist
	 */
	Module.prototype.load = function() {
		var that = this;
		var add_tool = function(tool) {
			that.bind_trigger(tool, "update", function() {
				// console.log('UPDATE');
				that.preview.send_trigger('update');
			});
			that.tools.push(tool);
		};

		/* Pencil */
		var tool = new Ctool_pencil({
			parent : this
		});
		add_tool.call(this, tool);
		this.selected = tool;
		/* Paintbrush */
		tool = new Ctool_paintbrush({
			parent : this
		});
		add_tool.call(this, tool);
		/* Eraser */
		tool = new Ctool_eraser({
			parent : this
		});
		add_tool.call(this, tool);
		/* Fill */
		tool = new Ctool_fill({
			parent : this
		});
		add_tool.call(this, tool);
		/* Color picker */
		tool = new Ctool_color_picker({
			parent : this
		});
		add_tool.call(this, tool);
	};
	/**
	 * 
	 */
	Module.prototype.update = function() {
		this.brush_manager.selected.callback.update
				.call(this.brush_manager.selected);
		this.selected.update();
		this.preview.send_trigger('update');
	};

	/**
	 * Select tool
	 * 
	 * @param cTool
	 */
	Module.prototype.select_tool = function(cTool) {
		if (cTool == undefined) {
			console.warn('Can\'t select undefined tool');
			return false;
		}
		var e = $(cTool.rootElm);
		e.parents('.group-tools').find('.tool').removeClass('selected');
		e.children('.tool').addClass('selected');
		var g = e.parents('.toolbox').find('.group-options');
		g.children('div').detach();
		g.append(cTool.dom_build_options());
		this.selected = cTool;
		this.update();
		return true;
	};

	/**
	 * Switch foreground and background color
	 */
	Module.prototype.switch_color = function() {
		var tmp = this.fg_color;
		this.fg_color = this.bg_color;
		this.bg_color = tmp;
		var $holder = this.rootElm.find('.colorpicker-colors');
		$holder.children('.colorpicker').detach();
		this.dom_build_colorpickers($holder);
		this.send_trigger('update_foreground_color');
	};

	/**
	 * Build html for fg/bg colors
	 * 
	 * @param $root
	 */
	Module.prototype.dom_build_colorpickers = function($root) {
		$root.append(this.fg_color.dom_get());
		$root.append(this.bg_color.dom_get());
	};

	/**
	 * Build html associted with this element
	 * 
	 * @returns {Module}
	 */
	Module.prototype.dom_build = function() {
		var that = this;
		var r = $('<div title="Toolbox"/>');
		r.addClass('toolbox');
		var g = $('<div />');
		g.addClass('group group-tools ui-widget-content');
		/* Adding Tools */
		for ( var i = 0; i < this.tools.length; i++) {
			var cTool = this.tools[i];
			/* Binding each tool_selected event */
			cTool
					.bind_trigger(
							cTool,
							'tool_selected',
							function(e, tTool) {
								if (!(tTool instanceof Ctool)) {
									console
											.error('Trigger tool_selected must pass a Ctool argument');
									return false;
								}
								that.select_tool(tTool);
								return true;
							});
			var e = cTool.dom_get();
			if (this.selected == cTool) {
				cTool.rootElm.children('.tool').addClass('selected');
			}
			/* Append our tool */
			g.append(e);
		}
		r.append(g);
		/* Color picker */
		g = $('<div/>');
		g.addClass('ui-widget-content group-colorpicker');
		var cp = $('<div/>');
		cp.addClass('ui-widget-content colorpicker-colors');
		this.dom_build_colorpickers(cp);
		g.append(cp);
		g.append($(new Cicon({
			name : 'stock-default-colors',
			size : 12,
			callback_click : function(obj) {
				that.send_trigger('switch_color');
				that.update();
			},
			label : T('switch_color')
		}).dom_get().addClass('switch')));
		// g.hide();
		r.append(g);
		/* Preview */
		g = $('<div/>');
		g.addClass('group-preview ui-widget-content');
		g.append(this.preview.dom_get());
		r.append(g);
		/* Options */
		g = $('<div />');
		g.addClass('group-options ui-widget-content');
		r.append(g);
		/* Options */
		g = $('<div />');
		g.addClass('group-brushmanager ui-widget-content');
		g.append(this.brush_manager.dom_get());
		r.append(g);
		/* setting rootElm */
		this.rootElm = r;
		return this;
	};

	graphit.export(modulePath, Module);

})(window, graphit, console);
