
/**
 * 
 * @param ptype
 * @returns
 */function Cdraw_tool(parent, ptype) {
	var that = this;
	this.parent = parent;
	this.type = ptype;
	this.options = {
			src: 'img/32x32_tool_' + this.type + '.png',
			//src_pushed: 'img/32x32_tool_' + this.type + '_pushed.png',
			click: function(obj) { that.callback_click(obj); }
	};
	this.image = new Cimage_button(this.options);
};


Cdraw_tool.prototype.callback_click = function(obj) {
	this.parent.select(this);
};

/**
 * 
 * @returns
 */
Cdraw_tool.prototype.dom_build = function() {
	this.rootElm = this.image.dom_get();
	return this;
};

/**
 * 
 */
Cdraw_tool.prototype.dom_get = function() {
	return this.dom_build().rootElm;
};
/******************************************************************************
 * 
 *
 */
function Cdraw_tool_pen(parent) {
	Cdraw_tool.call(this, parent, 'pen');
}

Cdraw_tool_pen.prototype = Object.create(Cdraw_tool.prototype);
Cdraw_tool_pen.prototype.constructor = new Cdraw_tool();


/******************************************************************************
 * 
 *
 */
function Cdraw_tool_fill(parent) {
	Cdraw_tool.call(this, parent, 'fill');
}

Cdraw_tool_fill.prototype = Object.create(Cdraw_tool.prototype);
Cdraw_tool_fill.prototype.constructor = new Cdraw_tool();

/******************************************************************************
 * 
 *
 */
function Cdraw_tool_eraser(parent) {
	Cdraw_tool.call(this, this, 'eraser');
}

Cdraw_tool_eraser.prototype = Object.create(Cdraw_tool.prototype);
Cdraw_tool_eraser.prototype.constructor = new Cdraw_tool();


/******************************************************************************
 * 
 *
 */
function Cdraw_tool_brush(parent) {
	Cdraw_tool.call(this, this, 'brush');
}

Cdraw_tool_brush.prototype = Object.create(Cdraw_tool.prototype);
Cdraw_tool_brush.prototype.constructor = new Cdraw_tool();

/******************************************************************************
 * 
 * 
 */
function Cdraw_toolbox_colorpicker(color) {
	Cobject.call(this);
	if (color && !(color instanceof Ccolor)) {
		console.error('color parameter is not an instance of Ccolor');
		return null;
	} else if (color) {
		this.color = color;
	} else {
		this.color = new Ccolor();
	}
	this.rootElm = null;
	this.cCanvas = new Ccanvas(32,32);
	this.ctx = this.cCanvas.getContext('2d');
	this.clear(this.color);
}

Cdraw_toolbox_colorpicker.prototype = Object.create(Cobject.prototype);
Cdraw_toolbox_colorpicker.prototype.constructor = new Cobject();

Cdraw_toolbox_colorpicker.prototype.clear = function(color) {
	this.cCanvas.clear(color);
};

Cdraw_toolbox_colorpicker.prototype.dom_build = function(bool) {
	var that = this;
	if (this.rootElm) { return this;}
	var root = document.createElement('div');
	var $r = $(root);
	var img = document.createElement('canvas');
	img.setAttribute('width', 32);
	img.setAttribute('height', 32);
	this.elmImage = img;
	$r.append(img);
	var ctx = img.getContext('2d');
	var c = this.cCanvas.canvas;
	ctx.drawImage(c, 0, 0, c.width, c.height);
	var update = function(obj, rgb) {
		that.clear(new Ccolor().set_rgb(rgb));
		ctx.drawImage(c, 0, 0, c.width, c.height);
	};
	$(img).ColorPicker({
		onChange : function(hsb, hex, rgb) {
			update(this, rgb);
		},
		onSubmit : function(hsb, hex, rgb) {
			update(this, rgb);
		}
	});
	this.rootElm = $r;
	return this;
};

/**
 * 
 * @returns
 */
Cdraw_toolbox_colorpicker.prototype.dom_get = function() {
	return this.dom_build().rootElm;
};


/******************************************************************************
 * 
 *
 */
function Cdraw_toolbox() {
	Cobject.call(this);
}

Cdraw_toolbox.prototype = Object.create(Cobject.prototype);
Cdraw_toolbox.prototype.constructor = new Cobject();

Cdraw_toolbox.prototype.init = function() {
	this.selected_tool = null;
	this.tools = new Array();
	this.bg_color = new Cdraw_toolbox_colorpicker(new Ccolor(255,255,255,1));
	this.fg_color = new Cdraw_toolbox_colorpicker(new Ccolor(0,0,0,1));
	this.elmPreview = null;
	this.elmOptions = null;
	this.rootElm = null;
	this.dom_build();
};

Cdraw_toolbox.prototype.add_tool = function(cTool) {
	cTool.parent = this;
	console.log("Adding tool: " + cTool.type);
	cTool.dom_build();
	this.tools.push(cTool);
};

Cdraw_toolbox.prototype.select = function(cTool) {
	console.log("Selecting: " + cTool.type);
	$(cTool.rootElm).parent().children('.button').removeClass('selected');
	$(cTool.rootElm).addClass('selected');
	this.selected = cTool;
};

Cdraw_toolbox.prototype.dom_build = function() {
	var that = this;
	var root = document.createElement('div');
	var $r = $(root);
	$r.addClass('toolbox ' + DRAWGLOB.css_draggable_class);
	helper_build_header($r, 'toolbox', 'Tools');
	$r.addClass('draggable toolbox');
	var $group = $(document.createElement('div'));
	$group.addClass('group-tools not-draggable');
	var click = function(t) {
		console.log('Click', t);
	};
	for ( var i = 0; i < this.tools.length; i++) {
		console.log('add tool', i);
		var tool = this.tools[i];
		$group.append(tool.dom_get());
	}
	$r.append($group);
	$group = $(document.createElement('div'));
	$group.addClass('group-colorpicker not-draggable');
	$group.append(this.bg_color.dom_get());
	$group.append(this.fg_color.dom_get());
	$r.append($group);
	this.rootElm = $r;
	return this;
};

Cdraw_toolbox.prototype.dom_get = function() {
	return this.dom_build().rootElm;
};
