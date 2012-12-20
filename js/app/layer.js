(function(window, graphit, console, undefined) {

	'use strict';
	
	var modulePath = 'app/layer';

	/**
	 * Import
	 */
	var Cobject = graphit.import('lib/object');
	var Cvector2d = graphit.import('lib/math/vector2d');
	var Ecomposite_operation = graphit.import('app/enum/compositeOperation');
	var Ccanvas = graphit.import('lib/canvas');
	var Cicon = graphit.import('lib/icon');
	var Cimage = graphit.import('lib/image');
	var Cfrag = graphit.import('app/frag');

	/*******************************************************************************
	 * 
	 */
	var E_DRAWCOMPOSITION = new Object({
		'source-in' : 'source-in',
		'source-over' : 'source-over'
	});

	/***************************************************************************
	 * @constructor
	 * @param parent
	 * @param label
	 * @returns
	 */
	function Module(options) {
		var that = this;
		options = options || {};
		options.className = modulePath;
		options.label = options.label || 'layer';
		options.position = options.position || new Cvector2d({
			x : 0,
			y : 0
		});
		options.composite_operation = options.composite_operation
				|| Ecomposite_operation['source-over'];
		options.visible = (options.visible != undefined ? options.visible
				: false);
		options.need_redraw = true;
		Cobject.call(this, options, [
				'parent', 'width', 'height', 'composite_operation',
				'need_redraw', 'visible'
		]);
	}
	;

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * Initialize layer
	 */
	Module.prototype.init = function() {
		var that = this;
		/* We are validating width & height our throwing exception */
		if (!this.width || this.width < 0 || this.width > 1920) {
			console.error('gabou', this);
			this.exception('invalid_width', this.width);
		}
		if (!this.height || this.height < 0 || this.height > 1280) this
				.exception('invalid_height', this.height);
		/* Our fragments store */
		this.frags = new Array();
		/* Our canvas element holding assembled fragments */
		this.cCanvas = new Ccanvas({
			width : this.width,
			height : this.height
		});
		/* Installing trigger */
		this.bind_trigger(this, 'redraw_preview', function(e, d) {
			if (window.graphit.debug > 4) console.debug('[Trigger/received]',
					e.type);
			that.redraw_preview();
		});
	};

	/**
	 *
	 */
	Module.prototype.get_width = function() {
		return this.cCanvas.get_width();
	};

	/**
	 *
	 */
	Module.prototype.get_height = function() {
		return this.cCanvas.get_height();
	};

	/**
	 *
	 */
	Module.prototype.getImageData = function(x, y, width, height) {
		return this.cCanvas.getImageData(x, y, width, height);
	};

	Module.prototype.clone = function() {
		var canvas = this.cCanvas.data;
		var cLayer = new Module({
			parent : this.parent,
			label : this.label,
			composite_operation : this.composite_operation,
			width : this.width,
			height : this.height
		});
		cLayer.visible = this.visible;
		cLayer.cCanvas.getContext().drawImage(canvas, 0, 0, canvas.width,
				canvas.height);
		cLayer.need_redraw = false;
		cLayer.rootElm = this.rootElm;
		return cLayer;
	};

	/**
	 * @returns
	 */
	Module.prototype.discard_frag = function() {
		this.need_redraw = true;
		return this.frags.pop();
	};

	/**
	 * 
	 */
	Module.prototype.dom_get = function(index) {
		this.dom_build();
		return this.rootElm;
	},

	Module.prototype.set_visibility = function(b) {
		if (b) {
			this.visibility = true;
		} else {
			this.visibility = false;
		}
	};

	Module.prototype.toggle_visibility = function() {
		if (this.visibility == true) {
			return this.set_visibility(false);
		} else {
			return this.set_visibility(true);
		}
	};

	/**
	 * @returns {Module}
	 */
	Module.prototype.dom_build = function() {
		if (this.rootElm) {
			return this;
		}
		// console.log('index', index);
		var that = this;
		var root = document.createElement('li');
		var $r = $(root);
		$r.attr('id', this.uid);
		$r.addClass('layer');
		var tabs = $('<div/>');
		tabs.attr('id', this.uid);
		var ul = $('<ul />');
		ul.append('<li><a href="#' + this.guid(1) + '">layer</a></li>');
		ul.append('<li><a href="#' + this.guid(2) + '">option</a></li>');
		ul.append('<li><a href="#' + this.guid(3) + '">stats</a></li>');
		tabs.append(ul);
		var tab1 = $('<div id="' + this.guid(1) + '"/>');
		var button = new Cicon({
			name : 'stock-eye',
			size : 20,
			callback_click : function(obj) {
				that.toggle_visibility();
				that.send_trigger('update');
			}
		});
		var table = document.createElement('table');
		var $t = $(table);
		;
		var $tr = $(document.createElement('tr'));
		var $td = $(document.createElement('td'));

		$td.append(button.dom_get());
		$tr.append($td);
		$td = $(document.createElement('td'));
		var $txt = '<span>Layer - ' + this.label + '</span>';
		$td.css('width', '100px');
		$td.css('text-overflow', 'ellipsis');
		$td.append($txt);
		$td.editInPlace({
			callback : function(original_element, html, originals) {
				that.label = html;
				return html;
			}
		});
		$td.addClass('label');
		$tr.append($td);
		$td = $(document.createElement('td'));
		$td.addClass('preview');
		var canvas = document.createElement('canvas');
		this.canvas_preview = canvas;
		var width = 100;
		var height = width
				* (this.cCanvas.data.height / this.cCanvas.data.width);
		canvas.width = width;
		canvas.height = height;
		var $c = $(canvas);
		$td.click(function() {
			var e = $(this).parents('.group-layers');
			e.find('.layer').removeClass('selected');
			$(this).parents('.layer').addClass('selected');
			that.parent.select(that);
		});
		$td.append($c);
		$tr.append($td);
		$td = $(document.createElement('td'));
		var baseUrl = window.graphit.baseStaticContent + '/';
		var b_up = new Cicon({
			name : 'stock-gravity-north',
			size : 24,
			width : 16,
			height : 16,
			callback_click : function(obj) {
				that.parent.move_up(that.uid);
			}
		});
		$td.append(b_up.dom_get());
		var b_down = new Cicon({
			name : 'stock-gravity-south',
			size : 24,
			width : 16,
			height : 16,
			callback_click : function(obj) {
				that.parent.move_down(that.uid);
			}
		});
		$td.append(b_down.dom_get());
		var b_trash = new Cimage({
			src : baseUrl + 'images/16x16_trash.png',
			width : 16,
			height : 16,
			callback_click : function(obj) {
				var $s = $(this).parents('li.layer');
				if ($s) {
					$r.remove();
					that.parent.remove(that);
				} else {
					console.error('Cannot remove layer element');
				}
			}
		});
		$tr.append($td);
		$td = $(document.createElement('td'));
		$td.addClass('options');
		$td.append(b_trash.dom_get());
		$tr.append($td);
		$t.append($tr);
		tab1.append($t);
		tabs.append(tab1);
		var tab2 = $('<div id="' + this.guid(2) + '"/>');
		tab2.append('<p>Layer option</p>');
		tabs.append(tab2);
		var tab3 = $('<div id="' + this.guid(3) + '"/>');
		tab3.append('<p>Total fragment: <span id="'
				+ this.guid('total-fragment') + '">' + this.frags.length
				+ '</span></p>');
		this.bind_trigger(this, 'redraw_preview', function(e, d) {
			tab3.find('span').empty().append(that.frags.length);
		});
		tabs.append(tab3);
		$r.append(tabs);
		tabs.tabs();
		this.rootElm = $r;
		return this;
	};

	/**
	 * 
	 */
	Module.prototype.redraw_preview = function() {
		var ctx = this.canvas_preview.getContext('2d');
		var scanvas = this.cCanvas.data;
		ctx.clearRect(0, 0, scanvas.width, scanvas.height);
		ctx.drawImage(scanvas, 0, 0, scanvas.width, scanvas.height, 0, 0,
				this.canvas_preview.width, this.canvas_preview.height);
	};

	/**
	 * @returns {Boolean}
	 */
	Module.prototype.redraw = function(bool) {
		if (typeof (bool) === 'boolean') {
			this.need_redraw = bool;
		}
		if (!this.need_redraw) {
			return false;
		}
		var ctx = this.cCanvas.getContext();
		ctx.clearRect(0, 0, this.cCanvas.data.width, this.cCanvas.data.height);
		if ('compositeOperation' in this) {
			ctx.compositeOperation = this.compositeOperation;
		}
		var dwidth = this.cCanvas.data.width;
		var dheight = this.cCanvas.data.height;
		for ( var i = 0; i < this.frags.length; i++) {
			var f = this.frags[i];
			var scanvas = f.cCanvas.data;
			var height = scanvas.height;
			var width = scanvas.width;
			var x = f.position.x;
			if (x < 0) {
				x = 0;
			} else if ((x + width) > dwidth) {
				width = dwidth - x;
			}
			var y = f.position.y;
			if (y < 0) {
				y = 0;
			} else if ((y + height) > dheight) {
				height = dheight - y;
			}
			ctx.save();
			ctx.beginPath();
			ctx.rect(x, y, width, height);
			ctx.clip();
			if (f.downCompositeOperation) {
				ctx.globalCompositeOperation = f.downCompositeOperation;
			} else {
				ctx.globalCompositeOperation = 'source-over';
			}
			ctx.drawImage(scanvas, 0, 0, width, height, x, y, width, height);
			ctx.restore();
		}
		this.send_trigger('redraw_preview');
		// this.redraw_preview();
		this.need_redraw = false;
		return true;
	};

	/**
	 * 
	 */
	Module.prototype.clear = function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.frags = new Array();
	};

	/**
	 * @param canvas
	 * @param sx
	 * @param sy
	 * @param swidth
	 * @param sheight
	 * @param tx
	 * @param ty
	 */
	Module.prototype.drawImage = function(canvas, sx, sy, swidth, sheight, tx,
			ty, compositeOperation) {
		// console.log('drawImage', canvas.toDataURL());
		var frag = new Cfrag({
			parent : this,
			position : new Cvector2d({
				x : sx,
				y : sy
			}),
			width : swidth,
			height : sheight
		});
		frag.drawImage(canvas, sx, sy, swidth, sheight, 0, 0);
		this.frags.push(frag);
		/* TODO: opying new frag on bottom of bottom stack */
		if (compositeOperation) {
			frag.downCompositeOperation = compositeOperation;
		}
	};

	/**
	 *
	 */
	Module.prototype.copy = function(h) {
		this.drawImage(h.src, 0, 0, h.src.width, h.src.height, 0, 0);
	};

	Module.prototype.to_json = function() {
		return ({
			'label' : this.data,
			'data' : this.cCanvas.data.toDataURL()
		});
	};

	graphit.export(modulePath, Module);

})(window, graphit, console);
