(function(window, graphit, console, undefined) {

	var modulePath = 'app/brush/manager';
	
	var Cobject = graphit.import('lib/object');
	var Cbrush = graphit.import('app/brush');
	var Etype = graphit.import('app/brush/enum/type');
	var CTOOL_brushes = graphit.import('app/brush/tools');
	
	/**
	 * @constructor Class Module [jsgraph] 22 nov. 2012
	 */
	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.label = "brushmanager";
		this.brushes = [];
		this.selected = null;
		Cobject.call(this, options, [
			'parent'
		]);

	}

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 *
	 */
	Module.prototype.init = function(options, permitted) {
		this.add(new Cbrush({
			parent : this,
			type : Etype.js,
			name : 'circle',
			data : CTOOL_brushes.circle
		}));
		this.add(new Cbrush({
			parent : this,
			type : Etype.js,
			name : 'rectangle',
			data : CTOOL_brushes.rectangle
		}));
		this.add(new Cbrush({
			parent : this,
			type : Etype.js,
			name : 'scircle',
			data : CTOOL_brushes.scircle
		}));
	};

	/**
	 *
	 */
	Module.prototype.dom_build = function() {
		var that = this;
		var r = $('<div />');
		r.attr('id', this.guid());
		r.attr('title', this.label);
		var g = $('<div />');
		cEach(this.brushes, function(i, elm) {
			var b = elm.dom_get();
			if (that.selected == elm) {
				b.find('.group-brush').addClass('selected');
			}
			g.append(b);
		});
		r.append(g);
		this.rootElm = r;
		return this;
	};

	/**
	 *
	 */
	Module.prototype.add = function(cBrush) {
		var that = this;
		if (this.exists(cBrush)) {
			console.error('This brush is already present');
			return false;
		}
		if (!this.selected) {
			this.selected = cBrush;
		}
		this.bind_trigger(cBrush, 'brush_selected', function(e, cBrush) {
			if (!(cBrush instanceof Cbrush)) {
				console.error('Trigger brush_selected must reture a brush', e,
						cBrush);
				return false;
			}
			that.selected = cBrush;
			that.selected.update();
			that.send_trigger('update');
		});
		this.brushes.push(cBrush);
		this.send_trigger('update');
		return true;
	};

	/**
	 *
	 */
	Module.prototype.exists = function(cBrush) {
		cEach(this.brushes, function(elm) {
			if (elm.type == cBrush.type && elm.name == cBrush.name) {
				return true;
			}
		});
		return false;
	};

	graphit.export(modulePath, Module);
	
})(window, graphit, console);
