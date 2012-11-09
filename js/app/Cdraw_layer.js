/*******************************************************************************
 * 
 */
var E_DRAWCOMPOSITION = new Object({
	'source-in' : 'source-in',
	'source-over' : 'source-over',

});

/*******************************************************************************
 * 
 * @param parent
 * @param label
 * @returns
 */
function Cdraw_layer(parent, label, p_composition) {
	var composition = p_composition;
	if (!composition) {
		composition = 'source-over';
	}
	this.composition = composition;
	this.parent = parent;
	this.label = label;
	this.frags = new Array();
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width', parent.width);
	this.canvas.setAttribute('height', parent.height);
	this.ctx = this.canvas.getContext('2d');
	this.need_redraw = true;
	this.rootElm = null;
};

/**
 * 
 * @returns
 */
Cdraw_layer.prototype.discard_frag = function() {
	//console.log('length: ' + this.frags.length);
	this.need_redraw = true;
	return this.frags.pop();
};

/**
 * 
 */
Cdraw_layer.prototype.dom_get = function(index) {
	this.dom_build(index);
	return this.rootElm;
},

/**
 * 
 * @returns {Cdraw_layer}
 */
Cdraw_layer.prototype.dom_build = function(index) {
	var root = document.createElement('li');
	var $r = $(root);
	$r.addClass('layer');
	var table = document.createElement('table');
	var $t = $(table);;
	var $tr = $(document.createElement('tr'));
	var $td = $(document.createElement('td'));
	$td.addClass('sortable-handle');
	$td.append("Move");
	$tr.append($td);
	$td = $(document.createElement('td'));
	$td.append('Layer - '+this.label);
	
	
	$tr.append($td);
	$td =  $(document.createElement('td'));
	var canvas = document.createElement('canvas');
	this.canvas_preview = canvas;
	//this.canvas = canvas;
	var $c = $(canvas);
	$c.attr('layer_index', index);
	var width = 100;
	var height = width * (this.canvas.height / this.canvas.width);
	$c.attr('width', width);
	$c.attr('height', height);
	$td.append($c);
	$tr.append($td);
	$t.append($tr);
	$r.append($t);
	this.rootElm = root;
	return this;
};


/**
 * 
 */
Cdraw_layer.prototype.redraw_preview = function() {
	//console.log('Redrawing preview');
	var c = $(this.rootElm).children('table').children('tbody').children('tr').children('td').children('canvas')[0];
	var ctx = c.getContext('2d');
	ctx.fillStyle = 'rgba(0,0,0,1)';
	ctx.strokeRect(0,0,this.canvas.width, this.canvas.jheight);
	ctx.stroke();
	ctx.drawImage(this.canvas, 0,0, this.canvas.width, this.canvas.height, 0, 0, c.width, c.height);
	
	//console.log(this.canvas.toDataURL());

};

/**
 * 
 * @returns {Boolean}
 */
Cdraw_layer.prototype.redraw = function(bool) {
	if (typeof(bool) === 'boolean') {
		this.need_redraw = bool;
	}
	if (!this.need_redraw) {
		return false;
	}
	this.ctx.globalCompositeOperation = this.composition;
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	for ( var i = 0; i < this.frags.length; i++) {
		var f = this.frags[i];
		this.ctx.drawImage(f.canvas, 0, 0, f.canvas.width, f.canvas.height,
				f.position.x, f.position.y, f.canvas.width, f.canvas.height);
	}
	this.redraw_preview();
	this.need_redraw = false;
	return true;
};

/**
 * 
 */
Cdraw_layer.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.frags = new Array();
};

/**
 * 
 * @returns
 */
Cdraw_layer.prototype.get_canvas = function() {
	this.redraw();
	return this.canvas;
};

/**
 * 
 * @param canvas
 * @param sx
 * @param sy
 * @param swidth
 * @param sheight
 * @param tx
 * @param ty
 */
Cdraw_layer.prototype.drawImage = function(canvas, sx, sy, swidth, sheight, tx,
		ty) {
	var frag = new Cdraw_frag(this, new Object({
		x : sx,
		y : sy
	}), swidth, sheight);
	frag.drawImage(canvas, sx, sy, swidth, sheight, tx, ty);
	this.frags.push(frag);
	try {
		this.ctx.drawImage(canvas, sx, sy, swidth, sheight, sx, sy, swidth,
				sheight);
		
	} catch (e) {
		console.error(e);
	};
};



/*******************************************************************************
 * 
 * @returns
 */
function Cdraw_layer_manager() {
	this.layers = new Array();
	this.special_layers = new Object();
	this.current_layer = null;
	this.rootElm = null;
};

Cdraw_layer_manager.prototype.add = function(layer) {
	if (!(layer instanceof Cdraw_layer)) {
		console.error('Layer manager need Cdraw_layer object');
		return false;
	}
	var reg = new RegExp(/^_(.*)/);
	var match = reg.exec(layer.label);
	if (match) {
		console.log('add special: ' + match[1]);
		layer.label = 'layer-' + match[1];
		this.special_layers[match[1]] = layer;
	} else {
		layer.label = 'layer-' + this.layers.length;
		console.log('add: ' + layer.label);
		this.layers.push(layer);
	}
	this.current_layer = layer;
	return true;
};

Cdraw_layer_manager.prototype.dom_build = function(parent) {
	var that = this;
	var root = document.createElement('div');
	var $r = $(root);
	$r.addClass('layer-manager draggable');
	$r.append('<h6 class="header">Layers</h6>');
	var group = document.createElement('ul');
	var $g = $(group);
	$g.addClass('group-layers');
	for(var i = this.layers.length - 1; i >= 0; i--) {
		var l = this.layers[i];
		$g.append(l.dom_get(i));
	}
	$g.sortable({ handle: '.sortable-handle',
		update: function(e, ui) {
			console.log('order changed: ' + ui.item);
			that.redraw();
		}
	});
	$g.selectable({ filter: '.layer',
		selected: function(e, ui) { 
			console.log('selected', e, ui);
			var l = $(ui.selected).find('canvas');
			console.log('INDEX: ', l.attr('layer_index'));
		}
	});
	$r.append($g);
	this.rootElm = $r;
	//parent.append($r):
	return this;
};

Cdraw_layer_manager.prototype.redraw = function() {
	for (var i = 0; i <= this.layers.length; i++) {
		this.layers[i].redraw();
	}
	
};
Cdraw_layer_manager.prototype.dom_get = function() {
	this.dom_build();
	return this.rootElm;
};


