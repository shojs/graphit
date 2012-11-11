/******************************************************************************
 * 
 * 
 */
function Ctoolbox_colorpicker(color) {
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

Ctoolbox_colorpicker.prototype = Object.create(Cobject.prototype);
Ctoolbox_colorpicker.prototype.constructor = new Cobject();

Ctoolbox_colorpicker.prototype.clear = function(color) {
	this.cCanvas.clear(color);
};

Ctoolbox_colorpicker.prototype.dom_build = function(bool) {
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
	var c = this.cCanvas.data;
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
Ctoolbox_colorpicker.prototype.dom_get = function() {
	return this.dom_build().rootElm;
};


/******************************************************************************
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
	this.selected_tool = null;
	this.tools = new Array();
	this.bg_color = new Ctoolbox_colorpicker(new Ccolor(255,255,255,1));
	this.fg_color = new Ctoolbox_colorpicker(new Ccolor(0,0,0,1));
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
	console.log('Loading tools');
	for (label in olist) {
		if (!('update' in olist[label]) && typeof(olist[label].update != 'function')) {
			console.error('Tool need update function');
			continue;
		}
		console.log('tool: ', label);
		var t = new Ctool(this, label);
		for (plabel in olist[label].parameters) {
			if (!t.add_parameter(olist[label].parameters[plabel])) {
				console.error('Cannot add parameter', label);
				continue;
			}	
			this.tools.push(t);
		}
	}
};


/**
 * 
 * @param cTool
 */
Ctoolbox.prototype.select_tool = function(cTool) {
	console.log("Selecting: " + cTool.label);
	$(cTool.rootElm).parent().children('.button').removeClass('selected');
	$(cTool.rootElm).addClass('selected');
	this.selected = cTool;
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

/**
 * 
 * @returns
 */
Ctoolbox.prototype.dom_get = function() {
	return this.dom_build().rootElm;
};
