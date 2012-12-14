(function(window, graphit, console, undefined) {

	var modulePath = 'app/layer/manager';

	var Cobject = graphit.import('lib/object');

	/***************************************************************************
	 * @constructor This class manage Csurface layers Each layers is composed of
	 *              n-fragments, that's how undo is implemented
	 */

	function Module(options) {
		var that = this;
		options = options || {};
		options.className = modulePath;
		options.label = 'layermanager';
		Cobject.call(this, options, [
			'parent'
		]);
		if (!this.parent) {
			this.exception('no_parent_parameter');
		}
		this.layers = new Array();
		this.special_layers = new Object();
		this.selected = null;
		this.dom_build();
		this.bind_trigger(this, 'update', function(e, v) {
			that.redraw();
		});
		var width = this.parent.get_width();
		var height = this.parent.get_height();
		this.add(new Clayer({
			parent : this,
			label : '_stack_up',
			width : width,
			height : height
		}));
		this.add(new Clayer({
			parent : this,
			label : '_stack_down',
			width : width,
			height : height
		}));
		var g = this.add(new Clayer({
			parent : this,
			label : '_grid',
			width : width,
			height : height
		}));
		var l = this.add(new Clayer({
			parent : this,
			label : 'background',
			width : width,
			height : height
		}));
	}
	;

	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * 
	 */
	Module.prototype.build_layer_stack = function(index) {
		this.special_layers.stack_down = this.layer_stack(0, index - 1);
		this.special_layers.stack_up = this.layer_stack(index + 1,
				this.layers.length - 1);
	};

	/**
	 * 
	 */
	Module.prototype.add = function(layer) {
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
			// layer.label = this.layers.length;
			this.layers.push(layer);
		}
		if (!match && this.rootElm) {
			var group = this.rootElm.find('.group-layers');
			var $lElm = $(layer.dom_get(this.layers.length - 1));
			group.prepend($lElm);
		}
		if (!this.selected) {
			this.selected = layer;
		}
		this.bind_trigger(layer, 'update', function(e, d) {
			that.redraw();
		});
		this.send_trigger('update');
		return layer;
	};

	/**
	 * 
	 */
	Module.prototype.layer_stack = function(start, end) {
		if (start > end) {
			return null;
		}
		var width = this.parent.get_width();
		var height = this.parent.get_height();
		var cLayer = new Clayer({
			parent : this,
			label : 'stack',
			width : width,
			height : height
		});
		var ctx = cLayer.cCanvas.getContext();
		var canvas;
		for ( var i = start; i <= end; i++) {
			canvas = this.layers[i].cCanvas.data;
			ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
		}
		return cLayer;

	};

	/**
	 * @param layer
	 * @returns
	 */
	Module.prototype.exists = function(layer) {
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

	/**
	 * @param layer
	 */
	Module.prototype.remove = function(layer) {
		var selected = this.selected;
		var idx = this.exists(layer);
		if ((selected == layer) && (idx > 1)) {
			selected = this.layers[idx - 1];
		}
		if (idx === undefined) {
			console.error('Cannot remove undefined element');
		}
		this.layers.splice(idx, 1);
		this.select(selected);
		this.parent.redraw(true);
	};

	/**
	 * @param id
	 * @returns {Clayer} layer
	 */
	Module.prototype.get = function(id) {
		if (!id || id == '__selected__') {
			return this.selected;
		}
		if (cMath.isint(id)) {
			return this.layers[id];
		}
		return this.special_layers[id];
	};

	/**
	 * @param id
	 * @returns
	 */
	Module.prototype.get_index_by_uid = function(id) {
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
	Module.prototype.move_down = function(id) {
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
		this.send_trigger('update');
		return true;
	};

	/**
	 * @param id
	 * @returns {Boolean}
	 */
	Module.prototype.move_up = function(id) {
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
		this.send_trigger('update');
		return true;
	};

	/**
	 * @param obj
	 * @returns {Boolean}
	 */
	Module.prototype.select = function(obj) {
		var index = this.exists(obj);
		if (index === undefined || index < 0 || index > this.layers.length) {
			console.error('Layer index out of range: ' + index);
			return false;
		}
		this.build_layer_stack(index);
		this.selected = this.layers[index];
		this.send_trigger('update');
		return true;
	};

	/**
	 * @param parent
	 * @param force
	 * @returns
	 */
	Module.prototype.dom_build = function() {
		var that = this;
		var r = $('<div />');
		r.attr('title', 'Layer manager');
		var main = $('<div />');
		// helper_build_header($r, this, 'Layers');

		var cmd = $('<div />');
		var b_add = new Cicon({
			name : 'stock-layer',
			size : 24,
			width : 16,
			height : 16,
			title : 'Create new layer',
			callback_click : function(obj) {
				that.add(new Clayer({
					parent : that,
					width : that.parent.get_width(),
					height : that.parent.get_height()
				}));
			}
		});
		r.append(b_add.dom_get());
		var group = $('<ul />');
		group.addClass('group-layers ui-widget-content');
		// main.append(cmd);
		r.append(group);
		r.append(main);
		this.rootElm = r;
		return this;
	};

	/**
	 * 
	 */
	Module.prototype._build_layer_preview = function(root) {
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
	Module.prototype.dom_exists = function(domLayer) {
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
	};

	/**
	 * 
	 */
	Module.prototype.redraw = function(force) {
		for ( var i = 0; i < this.layers.length; i++) {
			this.layers[i].redraw(force);
		}
	};

	graphit.export(modulePath, Module);

})(window, graphit, console);
