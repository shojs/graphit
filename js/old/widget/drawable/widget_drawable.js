/**
 * Widget Drawable constructor
 * @param < id >
 */

function widget_drawable(id) {
	if (!id) {
		console.error('widget_drawable need a id paramater');
		return null;
	}
	this.type = 'widget';
	this.name = 'drawable';
	this.id = this.type + '-' + this.name + '-' + id;
	this.rootElm = null;
	this.toolbar = null;
	this.surface = null;
	this._build();
	return this;
}

/*
 * 
 */
widget_drawable.prototype._build = function() {
	var idprefix = this.id;
	var rootNode = document.createElement('div');
	rootNode.setAttribute('id', idprefix);
	var imgNode = document.createElement('img');
	imgNode.setAttribute('id', idprefix + '-surface');
	imgNode.src = 'img/loading.png';
	$(imgNode).draggable();

	this._build_surface();
	rootNode.appendChild(this.surface.get_element());	
	
	this._build_toolbar();
	rootNode.appendChild(this.toolbar.get_element());
	//rootNode.appendChild(this.surface);
	this.rootElm = rootNode;
	return 1;
};


/**
 * 
 */
widget_drawable.prototype._build_surface = function(idnum) {
	var root = document.createElement('div');
	$(root).addClass('surface');
	
	var img = document.createElement('canvas');
	$(img).addClass('toolbar-brush-surface');
	//helper_draw_circle(img, 50, 50, 1, $(root).attr('picked-color'));
	
	this.surface = new widget_drawable_surface(this.id + '-' + 'surface');
	root.appendChild(this.surface.get_element());
	
	return this;
};
/**
 * 
 */
widget_drawable.prototype._build_toolbar = function(idnum) {
	var root = document.createElement('div');
	$(root).addClass('toolbar');
	
	var img = document.createElement('canvas');
	$(img).addClass('toolbar-brush-canvas');
	helper_draw_circle(img, 50, 50, 1, $(root).attr('picked-color'));
	
	this.toolbar = new widget_drawable_toolbar(this.id + '-' + 'toolbar');
	root.appendChild(this.toolbar.get_element());
	
	return this;
};

/**
 * 
 * @param idnum
 * @returns
 */
widget_drawable.prototype._build_toolbar_size = function(idnum) {
	var root = document.createElement('div');
	$(root).addClass('toolbar-size');
	var size = document.createElement('div');
	$(size).addClass('toolbar-size-slider');
	$(size).slider({min: 1, max: 50, step: 1, value: 1,
		change: function(event, ui) {
			var canvas = $(this).parent().parent().children('.toolbar-brush-canvas');
			if (!canvas && !canvas[0]) {
				console.error('Cannot get slider size brush canvas');
				return 0;
			}
			canvas = canvas[0];
			console.log(canvas);
			$(root).parent().attr('brush-size', ui.value);
			helper_draw_circle(canvas, 50, 50, ui.value, $(root).parent().attr('picked-color'));			
			return 1;
		}
	});
	root.appendChild(size);
	return root;
};

/**
 * 
 * @param idnum
 * @returns
 */
widget_drawable.prototype._build_toolbar_colorpicker = function(idnum) {
	var root = document.createElement('div');
	$(root).addClass('color-picker');
	$(root).jPicker({}, 
			function(color, ctx) {
				console.log('color chosen: ' + color);
			},
			function(color, ctx) {
				var c = color.val('all');
				var chtm = 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';
				$(root).parent().attr('picked-color', chtm);
				var canvas = $(root).parent().children('.toolbar-brush-canvas');
				if (!canvas || !canvas[0]) {
					console.error('Cannot get canvas!');
					console.error(canvas);
					return null;
				}
				canvas = canvas[0];
				var size = $(root).parent().attr('brush-size');
				helper_draw_circle(canvas, 50, 50, size, chtm);			
				return 1;
			},
			function(color, ctx) {
				console.log('cancel: ' + color);
			}
		);	
	return root;
};

/**
 * 
 * @param tElm
 * @returns {Number}
 */
widget_drawable.prototype.inject = function(tElm) {
	if (!$(tElm)) {
		console.error('Invalid DOM element:');
		console.error(tElm);
		return 0;
	}
	tElm.append(this.rootElm);
	return 1;
};

/**
 * 
 * @returns {Number}
 */
widget_drawable.prototype.test = function() {
	if (!this.inject($('#widget-drawable-test'))) {
		console.error('Cannot inject wiget_drawable nodes');
		return 0;
	}
	return 1;
};
