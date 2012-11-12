/*******************************************************************************
 * 
 * 
 */
function Ctoolbox_colorpicker(color, options) {
	Cobject.call(this, options, [ 'parent', 'callback_onchange' ]);
	if (color && !(color instanceof Ccolor)) {
		console.error('color parameter is not an instance of Ccolor');
		return null;
	} else if (color) {
		this.color = color;
	} else {
		this.color = new Ccolor();
	}
	this.rootElm = null;
	this.cCanvas = new Ccanvas(32, 32);
	this.ctx = this.cCanvas.getContext('2d');
	this.clear(this.color);
}

Ctoolbox_colorpicker.prototype = Object.create(Cobject.prototype);
Ctoolbox_colorpicker.prototype.constructor = new Cobject();

Ctoolbox_colorpicker.prototype.clear = function(color) {
	this.cCanvas.clear(color);
};

Ctoolbox_colorpicker.prototype.to_rgba = function() {
	return this.color.to_rgba();
};

Ctoolbox_colorpicker.prototype.dom_build = function(bool) {
	var that = this;
	if (this.rootElm) {
		return this;
	}
	var root = document.createElement('div');
	var $r = $(root);
	var img = document.createElement('canvas');
	img.setAttribute('width', 32);
	img.setAttribute('height', 32);
	this.elmImage = img;
	$r.append(img);
	var ctx = img.getContext('2d');
	var c = this.cCanvas.data;
	ctx.drawImage(c, 0, 0, c.width, c.height);
	var update = function(rgb) {
		that.color.set_rgb(rgb);
		that.clear(that.color);
		ctx.drawImage(c, 0, 0, c.width, c.height);
		var cb;
		(cb = that.callback_exists('onchange')) && cb.call(that, rgb);
	};
	$(img).ColorPicker({
		onChange : function(hsb, hex, rgb) {
			update.call(this, rgb);
		},
		onSubmit : function(hsb, hex, rgb) {
			update.call(this, rgb);
		}
	});
	this.rootElm = $r;
	return this;
};

/**
 * 
 * @returns
 */
Ctoolbox_colorpicker.prototype.dom_get = function() {
	return this.dom_build().rootElm;
};

/*******************************************************************************
 * 
 * 
 */
function Ctoolbox(olist) {
	this.olist = olist;
	Cobject.call(this);
}

Ctoolbox.prototype = Object.create(Cobject.prototype);
Ctoolbox.prototype.constructor = new Cobject();

/**
 * 
 */
Ctoolbox.prototype.init = function() {
	var that = this;
	this.selected = null;
	this.tools = new Array();
	this.fg_color = new Ctoolbox_colorpicker(new Ccolor(255, 255, 255, 1), {
		parent : this,
		callback_onchange : function(rgb) {
			// console.log('UPDATE RGB', this, this.parent);
			this.parent.selected.update();
		}
	});
	this.bg_color = new Ctoolbox_colorpicker(new Ccolor(0, 0, 0, 1), {
		parent : this
	});
	this.elmPreview = null;
	this.elmOptions = null;
	this.rootElm = null;
	this.load(this.olist);
	this.dom_build();
};

/**
 * 
 * @param olist
 */
Ctoolbox.prototype.load = function(olist) {
	for (label in olist) {
		console.log('--> Loading tool', label);
		if (!('brush' in olist[label])) {
			console.error('Tool need brush');
			continue;
		}
		olist[label].parent = this;
		var t = new Ctool(olist[label]);
		t.update();
		this.tools.push(t);
		this.selected = t;
	}
};

/**
 * 
 * @param cTool
 */
Ctoolbox.prototype.select_tool = function(cTool) {
	var $t = $(cTool.rootElm);
	$t.parent().children('div').removeClass('selected');
	$t.addClass('selected');
	var $gopt = $t.parents('.toolbox').find('.group-options');
	$gopt.children('div').detach();// empty();
	$gopt.append(cTool.dom_build_options());
	this.selected = cTool;
	cTool.update();
};

Ctoolbox.prototype.switch_color = function() {
	var tmp = this.fg_color;
	this.fg_color = this.bg_color;
	this.bg_color = tmp;
	var $holder = this.rootElm.find('.colorpicker-colors');
	$holder.children('.colorpicker').detach();
	this.dom_build_colorpickers($holder);
};

Ctoolbox.prototype.dom_build_colorpickers = function($root) {
	var that = this;
	$root.append(this.fg_color.dom_get());
	$root.append(this.bg_color.dom_get());
};

/**
 * 
 * @returns {Ctoolbox}
 */
Ctoolbox.prototype.dom_build = function() {
	var that = this;
	var root = document.createElement('div');
	var $r = $(root);
	$r.addClass('toolbox ' + DRAWGLOB.css_draggable_class);
	helper_build_header($r, 'toolbox', 'Tools');
	$r.addClass('draggable toolbox');
	var $group = $(document.createElement('div'));
	$group.addClass('group-tools group not-draggable');
	/* Tool */
	for ( var i = 0; i < this.tools.length; i++) {
		var tool = this.tools[i];
		$group.append(tool.dom_get());
	}
	$r.append($group);
	/* Color picker */
	$group = $(document.createElement('div'));
	$group.addClass('group group-colorpicker not-draggable');
	var $cp = $(document.createElement('div'));
	$cp.addClass('colorpicker-colors');
	this.dom_build_colorpickers($cp);
	$group.append($cp);
	$group.append(	$(new Cimage({
		src : 'img/16x16_toggle_color.png',
		callback_onload : function(obj) {
			;
		},
		callback_click : function(obj) {
			that.switch_color();
		},
		class: ''
	}).dom_get()));
	$r.append($group);
	/* Options */
	$group = $(document.createElement('div'));
	$group.addClass('group-options group');
	$r.append($group);
	/* Preview */
	this.rootElm = $r;
	return this;
};
