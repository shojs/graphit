/*******************************************************************************
 * 
 * A class representing our toolbox
 * - list of tools
 * - fg/bg colorpicker
 * - options associated with tools
 * - brush preview 
 */
function Ctoolbox(olist, options) {
	var that = this;
    	this.olist = olist;
	options.className = 'Ctoolbox';
	options.label = 'toolbox';
	Cobject.call(this, options, ['parent']);
	this.elmPreview = null;
	this.elmOptions = null;
	this.bind_trigger(this.fg_color, 'update', function(e, d) {
	    if (SHOJS_DEBUG > 4) console.log('[Trigger/received]', e.type);
	    that.send_trigger('update');
	});
	this.bind_trigger(this.bg_color, 'update', function(e, d) {
	    if (SHOJS_DEBUG > 4) console.log('[Trigger/received]', e.type);
	    that.send_trigger('update');
	});
}

Ctoolbox.prototype = Object.create(Cobject.prototype);
Ctoolbox.prototype.constructor = new Cobject();

/**
 * Auto called by parent class
 */
Ctoolbox.prototype.init = function() {
	var that = this;
	this.selected = null;
	this.tools = new Array();
	this.preview = new Ctoolbox_preview({
		parent : this
	});
	this.fg_color = new Ctoolbox_colorpicker(new Ccolor(255, 255, 255, 1), {
		parent : this,
		callback_onchange : function(rgb) {
			that.send_trigger('update');
		},
		label : 'Foreground color'
	});
	this.bg_color = new Ctoolbox_colorpicker(new Ccolor(0, 0, 0, 1), {
		parent : this,
		callback_onchange : function(rgb) {
			that.send_trigger('update');
		},
		label : 'Background color'
	});
	this.brush_manager = new Cbrush_manager();
	this.bind_trigger(this, 'update', function(e, d) {
		if (SHOJS_DEBUG > 4) console.log('[Trigger/received]', e.type);
		if (that.selected) that.selected.update();
	});
	this.load(this.olist);
	this.dom_build();
};

/**
 * Load tools from hash
 * 
 * @param olist
 */
Ctoolbox.prototype.load = function(olist) {
    	var that = this;
    	var selected = null;

	var change = function () {
	    that.send_trigger('update');
	};
	// We are parsing availble tools
	for (label in olist) {
		if (!('brush' in olist[label])) {
			console.error('Tool need brush');
			continue;
		}
		olist[label].parent = this;
		// We are installing parameter callback who keep track of change
		for (p in olist[label].parameters) {
		    olist[label].parameters[p].callback_change = change;
		    olist[label].parameters[p].callback_slide = change;
		}
		// We are creating our tool from hash
		var t = new Ctool(olist[label]);
		t.update();
		this.tools.push(t);
		// Selecting pen
		if (label == 'pen') {
		    console.log('selecting pen');
		    selected = t;
		}
	}
	this.selected = selected;
	this.select_tool(this.selected);
};
/**
 * 
 */
Ctoolbox.prototype.update = function() {
    if (!this.selected) {
	return false;
    }
    this.selected.update();
};

/**
 * Select tool
 * @param cTool
 */
Ctoolbox.prototype.select_tool = function(cTool) {
    	if (cTool == undefined) { 
    	    console.warn('Can\'t select undefined tool'); 
    	    return false;
    	}
	var $t = $(cTool.rootElm);
	$t.parent().children('div').removeClass('selected');
	$t.addClass('selected');
	var $g = $t.parents('.toolbox').find('.group-options');
	$g.children('div').detach();// empty();
	$g.append(cTool.dom_build_options());
	this.selected = cTool;
	cTool.update();
	this.send_trigger('update');
	return true;
};

/**
 * Switch foreground and background color
 */
Ctoolbox.prototype.switch_color = function() {
	var tmp = this.fg_color;
	this.fg_color = this.bg_color;
	this.bg_color = tmp;
	var $holder = this.rootElm.find('.colorpicker-colors');
	$holder.children('.colorpicker').detach();
	this.dom_build_colorpickers($holder);
	this.send_trigger('update');
};

/**
 * Build html for fg/bg colors
 * 
 * @param $root
 */
Ctoolbox.prototype.dom_build_colorpickers = function($root) {
	var that = this;
	$root.append(this.fg_color.dom_get());
	$root.append(this.bg_color.dom_get());
};

/**
 * Build html associted with this element
 * @returns {Ctoolbox}
 */
Ctoolbox.prototype.dom_build = function() {
	var that = this;
	var r = $('<div title="Toolbox"/>');
	r.addClass('toolbox');
	var g = $('<div />');
	g.addClass('group-tools ui-widget-content');
	/* Tool */
	for ( var i = 0; i < this.tools.length; i++) {
		var tool = this.tools[i];
		g.append(tool.dom_get());
	}
	r.append(g);
	/* Color picker */
	g = $('<div/>');
	g.addClass('ui-widget-content group-colorpicker');
	var cp = $('<div/>');
	cp.addClass('ui-widget-content colorpicker-colors');
	this.dom_build_colorpickers(cp);
	g.append(cp);
	g.append(	$(new Cimage({
		src : 'img/16x16_toggle_color.png',
		callback_onload : function(obj) {
			;
		},
		callback_click : function(obj) {
			that.switch_color();
		},
		label: 'Switch color'
	}).dom_get().addClass('switch')));
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
