/*******************************************************************************
 * 
 * @returns
 */
function Cdraw_layer_manager(parent) {
	this.parent = parent;
	this.layers = new Array();
	this.special_layers = new Object();
	this.current_layer = null;
	this.rootElm = null;
	this.dom_build();
};

Cdraw_layer_manager.prototype.add = function(layer) {
	layer.parent = this;
	var that = this;
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
		layer.label = this.layers.length;
		console.log('add: ' + layer.label);
		this.layers.push(layer);
	}
	this.current_layer = layer;
	if (!match && this.rootElm) {		
		var group = $(this.rootElm).children('.group-layers');
		var $lElm = $(layer.dom_get(this.layers.length - 1));
		$lElm.click(function() {
			$(this).parent().children('.layer').removeClass('selected');
			$(this).addClass('selected');
			that.select(layer);
		});
		group.prepend($lElm);
	}
	return true;
};


Cdraw_layer_manager.prototype.exists = function(layer) {
	var i = 0;
	var found = false;
	for (i = 0; i < this.layers.length; i++) {
		if (this.layers[i] == layer) {
			found = true;
			break;
		}
	}
	if (found) return i;
	return null;
};

Cdraw_layer_manager.prototype.remove = function(layer) {
	console.log('Removing element', layer);
	var idx = this.exists(layer);
	if (idx === undefined) {
		console.error('Cannot remove undefined element');
	}
	this.layers.splice(idx,1);
	this.parent.redraw();
};

Cdraw_layer_manager.prototype.dom_build = function(parent) {
	if (this.rootElm) {
		return this.rootElm;
	}
	var that = this;
	var root = document.createElement('div');
	var $r = $(root);
	$r.addClass('layer-manager draggable ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable ui-resizable ui-dialog-buttons');
	$r.append('<h6 class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">Layers</h6>');
	var cmd = document.createElement('div');
	var b_add = new Cimage_button({ src: 'img/16x16_create_file.png', width: 16, height: 16, 
		css: {
			display: 'inline-block',
		},
		click: function(obj) {
			console.log("Add Layer: ", obj);
			that.add(new Cdraw_layer(that));
			that.parent.redraw();
		}
	});
	$(cmd).append(b_add.dom_get());
	var group = document.createElement('ul');
	var $g = $(group);
	$g.addClass('group-layers ui-widget-content ui-helper-clearfix sortable-placeholder');
	$g.sortable({ handle: '.sortable-handle', 
		update: function(e, ui) {
			console.log('order changed: ' + ui.item);
			that.redraw();
			return true;
		}
	});
	$r.append(cmd);
	
	$r.append($g);
	this.rootElm = $r;
	return this;
};

Cdraw_layer_manager.prototype.select = function(obj) {
	var index = this.exists(obj);
	console.log("SELECT ", index);
	if (index === undefined || index < 0 || index > this.layers.length) {
		console.error('Layer index out of range: ' + index);
		return false;
	}
	this.current_layer = this.layers[index];
};

Cdraw_layer_manager.prototype.redraw = function() {
	for (var i = 0; i < this.layers.length; i++) {
		this.layers[i].redraw();
	}
	
};
Cdraw_layer_manager.prototype.dom_get = function() {
	this.dom_build();
	return this.rootElm;
};


