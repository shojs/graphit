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
		layer.label = 'layer-' + this.layers.length;
		console.log('add: ' + layer.label);
		this.layers.push(layer);
	}
	this.current_layer = layer;
	if (!match && this.rootElm) {		
		var elm = $(this.rootElm).children('.group-layers');
		elm.prepend(layer.dom_get(this.layers.length - 1));
		elm.sortable({ handle: '.sortable-handle',
			update: function(e, ui) {
				console.log('order changed: ' + ui.item);
				that.redraw();
			}
		});
		elm.selectable({ filter: '.layer canvas', 
			selected: function(e, ui) { 
				console.log('selected', e, ui);
				var l = $(ui.selected).parent().find('canvas');
				console.log('INDEX: ', l.attr('layer_index'));
				that.select(parseInt(l.attr('layer_index')));
				return false;
			},
		});
	
		
	}
	return true;
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
			that.add(new Cdraw_layer(that.parent));
			that.parent.redraw();
		}
	});
	$(cmd).append(b_add.dom_get());
	var group = document.createElement('ul');
	var $g = $(group);
	$r.append(cmd);
	$g.addClass('group-layers ui-widget-content ui-helper-clearfix');
	$r.append($g);
	this.rootElm = $r;
	return this;
};

Cdraw_layer_manager.prototype.select = function(index) {
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


