
/*******************************************************************************
 * 
 * @returns
 */

function Clayer_manager(parent) {
    this.parent = parent;
    this.layers = new Array();
    this.special_layers = new Object();
    this.selected = null;
    this.rootElm = null;
    this.dom_build();
    $(document).bind('shojs-update', function(e, d) {
	d.caller.redraw(true);
    });
    this.add(new Clayer(this, '_stack_up'));
    this.add(new Clayer(this, '_stack_down'));
    var g = this.add(new Clayer(this, '_grid'));
    var l = this.add(new Clayer(this, 'background'));
    this.layerstack_up = null;
    this.layerstack_bottom = null;
};

/**
 * 
 */
Clayer_manager.prototype.layer_stack = function(start, end) {
    if (start > end) {
	return null;
    }
    var l = new Clayer(this, 'stack');
    var canvas;
    for ( var i = start; i <= end; i++) {
	canvas = this.layers[i].cCanvas.data;
	l.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    }
    return l;

};

/**
 * 
 */
Clayer_manager.prototype.build_layer_stack = function(index) {
    this.special_layers.stack_down = this.layer_stack(0, index - 1);
    this.special_layers.stack_up = this.layer_stack(index + 1, this.layers.length - 1);
};

/**
 * 
 */
Clayer_manager.prototype.add = function(layer) {
    layer.parent = this;
    var that = this;
    if (!(layer instanceof Clayer)) {
	console.error('Layer manager need Clayer object');
	return null;
    }
    var reg = new RegExp(/^_(.*)/);
    var match = reg.exec(layer.label);
    if (match) {
	layer.label = 'layer-' + match[1];
	this.special_layers[match[1]] = layer;
    } else {
	layer.label = this.layers.length;
	this.layers.push(layer);
    }
    //this.selected = layer;
    if (!match && this.rootElm) {

	var group = $(this.rootElm).find('.group-layers');
	var $lElm = $(layer.dom_get(this.layers.length - 1));
	group.prepend($lElm);
    }
    //this.select(layer);
    $(document).trigger('shojs-update', { who: 'layer-manager', what: 'add-layer', caller: this});
    return layer;
};

Clayer_manager.prototype.exists = function(layer) {
    var i = 0;
    var found = false;
    for (i = 0; i < this.layers.length; i++) {
	if (this.layers[i] == layer) {
	    found = true;
	    break;
	}
    }
    if (found)
	return i;
    return null;
};

Clayer_manager.prototype.remove = function(layer) {
    var selected = this.selected;
    var idx = this.exists(layer);
    if (selected == layer && idx > 1) {
	selected == this.layers[idx - 1]; 
    }
    if (idx === undefined) {
	console.error('Cannot remove undefined element');
    }
    this.layers.splice(idx, 1);
    this.select(selected);
    this.parent.redraw(true);
};

Clayer_manager.prototype.get_layer = function(id) {
    if (cMath.isint(id)) {
	return this.layers[id];
    }
    return this.special_layers[id];
};

Clayer_manager.prototype.get_index_by_uid = function(id) {
    for ( var i = 0; i < this.layers.length; i++) {
	if (this.layers[i].uid == id) {
	    return i;
	}
    }
    return null;
};


/**
 * 
 */
Clayer_manager.prototype.move_down = function(id) {
    var idx = this.get_index_by_uid(id);
    if (idx === undefined || this.layers.length <= 1 || idx < 1) {
	console.error('Can\'t move layer up');
	return false;
    }
    var tmp = this.layers[idx - 1];
    this.layers[idx - 1] = this.layers[idx];
    this.layers[idx] = tmp;
    this.select(this.selected);
    this._build_layer_preview('.group-layers');
    $(document).trigger('shojs-update', 
	    { who: 'layer-manager', what: 'move-layer-down', caller: this});
    return true;
};

Clayer_manager.prototype.move_up = function(id) {

    if (this.layers.length == 1) {
	return false;
    }
    var idx = this.get_index_by_uid(id);
    if (idx === undefined || idx >= (this.layers.length - 1)
	    || this.layers.length <= 1) {
	console.error('Can\'t move layer up');
	return false;
    }
    var tmp = this.layers[idx + 1];
    this.layers[idx + 1] = this.layers[idx];
    this.layers[idx] = tmp;
    this.select(this.selected);
    this._build_layer_preview('.group-layers');
    $(document).trigger('shojs-update', 
	    { who: 'layer-manager', what: 'move-layer-up', caller: this});
    return true;
};

Clayer_manager.prototype.select = function(obj) {
    console.log('Selecting layer');
    var index = this.exists(obj);
    if (index === undefined || index < 0 || index > this.layers.length) {
	console.error('Layer index out of range: ' + index);
	return false;
    }
    this.build_layer_stack(index);
    this.selected = this.layers[index];

    $(document).trigger('shojs-update', 
	    { who: 'layer-manager', what: 'select-layer', caller: this});
    return true;
};


/**
 * 
 * @param parent
 * @param force
 * @returns
 */
Clayer_manager.prototype.dom_build = function(parent, force) {
    if (!force && this.rootElm) {
	return this.rootElm;
    }
    var that = this;
    var r = $('<div />');
    r.attr('title','Layer manager');
    var main = $('<div />');
    //helper_build_header($r, this, 'Layers');
    
    var cmd = $('<div />');
    var b_add = new Cimage({
	src : 'img/16x16_create_file.png',
	width : 16,
	height : 16,
	title : 'Create new layer',
	callback_click : function(obj) {
	    that.add(new Clayer(that));
	    //that.parent.redraw();
	}
    });
    r.append(b_add.dom_get());
    var group = $('<ul />');
    group.addClass('group-layers group');
    //main.append(cmd);
    r.append(group);
    r.append(main);
    this.rootElm = r;
    return this;
};

/**
 * 
 */
Clayer_manager.prototype._build_layer_preview = function(root) {
    var $r = $(root);
    $r.find('.layer').detach();
    for ( var i = this.layers.length - 1; i >= 0; i--) {
	this.layers[i].redraw(true);
	$r.append(this.layers[i].dom_get(1));
    }

};

/**
 * 
 */
Clayer_manager.prototype.dom_exists = function(domLayer) {
    var found = false;
    var i;
    for (i = 0; i < this.layers.length; i++) {
	if (this.layers[i].rootElm = domLayer) {
	    found = true;
	    break;
	}
    }
    if (found) {
	return i;
    }
    return null;
}


/**
 * 
 */
Clayer_manager.prototype.redraw = function(force) {
    for ( var i = 0; i < this.layers.length; i++) {
	this.layers[i].redraw(force);
    }

};

/**
 * 
 */
Clayer_manager.prototype.dom_get = function() {
    this.dom_build();
    return this.rootElm;
};
