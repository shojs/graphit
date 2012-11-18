(function($, undefined) {
    /***************************************************************************
     * JQ WIDGET surface
     */
    $.widget("shojs.layerManager", {
	options : {
	    autoOpen : false,
	    resizable : true,
	    width : 800,
	    height : 600,
	    label : 'Layer manager',
	},
	_create : function() {
	    this._first_create();
	},
	_first_create : function() {
	    var self = this;
	    var w = $('<div />');
	    w.dialog({title: 'Layer Manager'});
	    var childs = $(this.element).children('canvas');
	    var mg = $('<div />');
	    mg.addClass('layermanager-group-layer');
	    console.log('Init layer Manager', childs);
	    childs.each(function() {
		self._append_layer(mg, this);
	    });
	    w.append(mg);
	    this.element.parents('.surface').bind('surfaceupdate', function(d, e) {
		console.log('{{{{{{{{{{{{{{{{{ plop', d, e);
		self._update(d, e);
	    });
	    this.popup = w;
	    //w.append(this.element);
	    
	},
	_append_layer: function($r, layer) {
	    	var $l = $(layer);
		var g = $('<div />');
		g.addClass('layermanager-layer');
		console.log('---> Adding layer', this);
		g.append('<h2 class="label">Layer '+$l.attr('label')+'</h2>');
		//g.append(layer);
		$r.append(g);
	},
	_update: function(d, e) {
	    var self = this;
	    if (this.popup) {
		var childs = $(this.element).children('canvas');
		var root = this.popup.children('.layermanager-group-layer');
		root.empty();
		console.log('Updating layer manager', this.popup, root);
		childs.each(function() { self._append_layer(root, this) });
		
	    } else {
		this._first_create();
	    }
	},
	_open: function() {
	    console.log('opening');
	},
	_setOption : function(key, value) {
	    this.options[key] = value;
	    console.log('Setting option', key, value);
	    // this._update();
	},
	destroy : function() {
	    // call the base destroy function
	    $.Widget.prototype.destroy.call(this);
	},
    });

})(jQuery);
(function($, undefined) {
    /***************************************************************************
     * JQ WIDGET surface
     */
    $.widget("shojs.surface", {
	options : {
	    autoOpen : false,
	    resizable : true,
	    width : 800,
	    height : 600,
	    label : 'Surface',
	    isDialog: true,
	    className: 'surface',
	    hasSpecialLayer: true,
	    layerClassName: 'layer',
	    showTools: false,
	},
	_create : function() {
	    if (this.elmCanvas) {
		console.log('Existing information');
		return true;
	    }
	    this._first_create();
	    this._bind_keys();
	    var self = this;
	    $(this).bind('surfaceupdate', function() { self.update(); });
	    //$(this).trigger('update', 'First update');
	},
	_bind_keys: function() {
	   var self = $(this);
	   $(document).keydown('ctrl+z', function() {
		console.log('Undo');
		//this.undo();
	    });
	   this.element.bind('click', function() {console.log('click');});
	   //self.bind('update', function(e, msg) { this.update(e, msg); });
	},
	update: function(msg) {
	    console.log('Updating widget', this);
	    this.element.children('.' + this.options.layerClassName).each(function() {
		console.log('layers')
	    });
	},
	show_tools: function() {
	    this.n_layers.layerManager({});
	},
	hide_tools: function() {
	    this.n_layers.layerManager('destroy');
	},
	toggle_tools: function() {
	    if (this.showTool == true) {
		this.hide_tools();
	    } else {
		this.show_tools();
	    }
	},
	_first_create : function() {
	    console.log('First canvas initialization');
	    this.selected = null;
	    this.elmCanvas = this.element;
	    this.element.addClass(this.options.className);
	    var $p = this.element.parent();
	    var $e = this.element.detach();
	    var $g = $('<div />');
	    $g.addClass('surface-container');
	    $g.append($e);
	    $p.append($g);
	    if (this.options.isDialog) {
		this.element.dialog(this.options);
	    }
	    //var $g = this.elmCanvas.children('.group-layers');
	    var g = $('<div />');
	    g.addClass('group-' + this.options.layerClassName);
	    var nl = $('<div />');
	    nl.addClass('group-normal-' + this.options.layerClassName);
	    g.append(nl);
	    this.n_layers = nl;
	    if (this.options.hasSpecialLayer) {
		var sl = $('<div />');
	    	sl.addClass('group-special-' + this.options.layerClassName);
	    	g.append(sl);
	    	this.s_layers = sl;
	    }
	    this.elmCanvas.append(g);
	    if (this.element.attr('src')) {
		console.log('Canvas has src, loading image');
		this._load_image(this.element.attr('src'));
	    }

	},
	_load_image: function(src) {
	    var self = this;
	    var canvas = self.elmCanvas[0];
	    console.log('Loading image', src);
	    new Cimage({src: src,
		callback_onload: function() {
		    console.log('Image loaded', this);
		    var c = self.add_layer('background')[0];
		    c.getContext('2d').drawImage(
			    this.rootElm, 0,0, 
				    this.rootElm.width, 
				    this.rootElm.height);
		},
		callback_onerror: function() {
		    console.log('Failed to load image', this);
		}
	    });
	    return true;
	},
	_setOption : function(key, value) {
	    this.options[key] = value;
	    console.log('Setting option', key, value);
	    // this._update();
	},

	destroy : function() {
	    // call the base destroy function
	    $.Widget.prototype.destroy.call(this);
	},
	close : function() {
	    this._isOpen = false;

	    // trigger close event
	    this._trigger("close");

	    return this;
	},
	add_layer : function(label) {
	    label = label || 'new layer';
	    console.log("Adding layer");
	    var canvas =  document.createElement('canvas');
	    var $c = $(canvas);
	    $c.width = this.width;
	    $c.height = this.heigth;
	    $c.attr('label', label);
	    $c.surface({
		label : label,
		isDialog: false,
		className: 'layer',
		layerClassName: 'fragment',
		hasSpecialLayer: false,
	    });
	    this.n_layers.append($c);
	    this._trigger('update', null, { type: 'layer_added' });
	    return $c;
	},
    });
//    $.extend($.ui.mywidget, {
//	instances : []
//    });

})(jQuery);

$.shojs.surface.prototype.log = function(msg) {
    console.log(msg);
};
