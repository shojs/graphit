(function(window, graphit, console, undefined) {
	
	'use strict';
	
	var modulePath = 'app/tool';
	
	var Cobject = graphit.import('lib/object');
	var Cicon = graphit.import('lib/icon');
	var Ccanvas = graphit.import('lib/canvas');
	var Ccolor = graphit.import('lib/color');

	var PO = new(graphit.import('lib/po'))();
	var T = function(key) { return (PO.get(key) || key); };
	
	/***************************************************************************
	 * @constructor
	 * @param options
	 */
	var Module = function(options) {
		var that = this;
		options = options || {};
		options.className = modulePath;
		options.label = options.label || 'tool';
		this.brush = null;
		this.cCanvas = null;
		this.need_update = true;
		this.rootElm = null;
		this.optElm = null;

		this.changeCursor = true;
		for (var p in options.parameters) {
			options.parameters[p].parent = this;
		}
		Cobject.call(this, options, [
				'parent', 'brush', 'label', '_pregraph', '_graph',
				'_postgraph', '_update', 'compositeOperation'
		]);
		for (var p in this.parameters) {
			// console.log("Binding tool to parameter update", p);
			this.bind_trigger(this.parameters[p], "parameter_update", function(e, d) {
				that.update();
			});
		}
		return this;
	}
	;

	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * @param width
	 * @param height
	 * @return
	 */
	Module.prototype.canvas_create = function(width, height) {
		if (!width || width < 0 || width > 1920) {
			console.error('Width not in range', width);
			return null;
		} else if (!height || height < 0 || height > 1080) {
			console.error('Height not in range', height);
			return null;
		}
		this.set_parameter('width', width);
		this.set_parameter('height', height);
	};

	/**
	 * @param options
	 * @returns {Boolean}
	 */
	Module.prototype.set_options = function(options) {
		if (!options.brush) {
			console.error('No brush in Module options');
			return false;
		}
	};

	/**
	 * @param elapsed
	 * @returns {Boolean}
	 */
	Module.prototype.update = function() {
		var preview = this.parent.content.get_child({label: 'toolbox_preview'}).canvas;
		this.draw_preview(preview);
//		
//		console.log('Update tool');
//		this.need_update = true;
//		if (!this.need_update) {
//			console.log('Doesn\'t need update');
//			return false;
//		}
//		var size = this.get_parameter('size');
//		if (!size) this.exception('no_size_parameter', this.label);
//		// var dsize = size / 2;
//		this.cCanvas = new Ccanvas({
//			width : size,
//			height : size
//		});
//		this.ctx = this.cCanvas.getContext('2d');
//		var cBrush = this.parent.brush_manager.selected;
//		var scanvas = cBrush.cCanvas.data;
//		this.ctx.drawImage(scanvas, 0, 0, scanvas.width, scanvas.height, 0, 0,
//				this.cCanvas.get_width(), this.cCanvas.get_height());
//		// this.brush.callback_update.call(this, this);
//		// if ('_update' in this) {
//		// this._update.call(this);
//		// }
//		this.need_update = false;
//		this.send_trigger('update');
	};

	/**
	 * @param t_canvas
	 * @param tx
	 * @param ty
	 * @return true on success
	 */
	Module.prototype.drawImage = function(t_canvas, tx, ty) {
		var ctx = t_canvas.getContext('2d');
		var sc = this.cCanvas.canvas;
		if (!ctx) {
			console.error('Cannot acquire context');
			return false;
		}
		if (tx > t_canvas.width || tx < 0) {
			console.error('x not in canvas destination range', tx);
			return false;
		}
		if (ty > t_canvas.height || ty < 0) {
			console.error('y not in canvas destination range', ty);
			return false;
		}
		ctx.drawImage(sc, 0, 0, sc.width, sc.height, tx, ty, sc.width,
				sc.height);
		return true;
	};

	/**
	 * 
	 */
	Module.prototype.onclick = function() {
		if ('callback_onclick' in this.options
				&& (typeof this.options.callback_onclick === 'function')) {
			this.options.callback_onclick(this);
		}
	};

	/**
	 * @param force
	 * @return Object instance
	 */
	Module.prototype.dom_build = function() {
		this.rootElm = this.dom_build_tool();
		return this;
	};

	/**
	 * @return {DOM Element}
	 */
	Module.prototype.dom_build_tool = function() {
		var that = this;
		var img = new Cicon({
			path : 'tools',
			name : 'stock-tool-' + this.label,
			callback_click : function(obj) {
				console.log('sending trigger');
				var root = that.parent.rootElm;
				that.parent.send_trigger('tool_selected', that);
				root.find('img').removeClass('selected');
				var img = root.find('img.' + that.get_dom_class());
				console.log('Img', img);
				img.addClass('selected');
			},
			label : 'tool_' + this.label
		});
		//img.dom_get().click(function() {console.log('plop');});
		return img.dom_get().addClass('group ' + this.get_dom_class());
	};

	/**
	 * @return {DOM Element}
	 */
	Module.prototype.dom_build_options = function() {
		if (this.optElm) {
			return this.optElm;
		}
		//var that = this;
		var $r = $(document.createElement('div'));
		$r.addClass('not-draggable');
		for (var label in this.parameters) {
			var param = this.parameters[label];
			$r.append(param.dom_get());
		}
		this.optElm = $r;
		return $r;
	};


	/* Graph one point */
	Module.prototype.graph = function(cMessage) {
		this.exceptions('method_must_be_overidden');
	};

	/**
	 * @param cMessage
	 */
	Module.prototype.pre_graph = function(cMessage) {

	};
	/**
	 * 
	 * @param cMessage
	 */
	Module.prototype.post_graph = function(cMessage) {

	};

	/**
	 * Method draw_preview
	 * graphit[js/app/tool.js]
	 * sho / 20 déc. 2012 / 09:31:27
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.draw_preview = function(canvas) {
		var red = new Ccolor({r:255,a:1}); 
		canvas.clear(new Ccolor());
		var ctx = canvas.getContext('2d');
		ctx.save();
		ctx.fillStyle = red.to_rgba();
		ctx.fillText(T('no_preview'), 25, 50, 90);
		ctx.restore();
	};
	
	graphit.export(modulePath, Module);
	
})(window, graphit, console);
