(function(window, graphit, console, undefined) {

	var modulePath = 'lib/mouse/tracker';
	
	var Cobject = graphit.import('lib/object');
	var Cvector2d = graphit.import('lib/math/vector2d');
	var cMath = graphit.import('lib/math');

	/**
	 * @constructor
	 * @param min
	 * @param max
	 */
	function Cminmax(min, max) {
		this.min = min;
		this.max = max;
		this.last = null;
	}
	;

	Cminmax.prototype.init = function(v) {
		this.min = this.max = this.last = v;
	};

	Cminmax.prototype.cmp = function(v) {
		if (v == undefined) {
			console.warn('MinMax: Comparing with null value');
			return false;
		}
		if (v < this.min) {
			this.min = v;
		}
		if (v > max) {
			this.max = v;
		}
		this.last = v;
		return true;
	};

	/***************************************************************************
	 * Object to hold mouse position
	 * 
	 * @constructor
	 * @param pos
	 *            {Object} Object with <x> and <y> property
	 * @returns {Object}
	 */
	function Cmouse_tracker_point(pos) {
		Cvector2d.call(this, pos);
		this.time = Date.now();
	}

	Cmouse_tracker_point.prototype = Object.create(Cvector2d.prototype);
	Cmouse_tracker_point.prototype.constructor = new Cvector2d({
		x : 0,
		y : 0
	});
	/***************************************************************************
	 * Tracking mouse movement
	 * 
	 * @constructor
	 * @author %AUTHOR
	 * @param options
	 */
	function Cmouse_tracker(options) {
		options.className = 'Cmouse_tracker';
		options.label = 'mousetracker';
		Cobject.call(this, options, [
				'parent', 'callback_move', 'callback_track'
		]);

		// this.bounding = new Cbounding_rectangle({position: new Cpoint2d({x:
		// 0, y:
		// 0}), width: 0, height: 0});
		this.x = 0;
		this.y = 0;
		this.cMinmaxX = new Cminmax(0, this.parent.width);
		this.cMinmaxY = new Cminmax(0, this.parent.height);

		this.minmax = new Object({
			minx : 0,
			maxx : this.parent.width,
			miny : 0,
			maxy : this.parent.height
		});
		this.minx = this.minmax.maxx;
		this.maxx = 0;
		this.miny = this.minmax.maxy;
		this.maxy = 0;

		this.pushed = null;
		this.paused = false;
		this.interval = null;
		this.points = new Array();
		this.rootElm = null;
		return this;
	}

	Cmouse_tracker.prototype = Object.create(Cobject.prototype);
	Cmouse_tracker.prototype.constructor = new Cobject();

	/**
	 * 
	 */
	Cmouse_tracker.prototype.reset = function() {
		this.minx = this.minmax.maxx;
		this.maxx = 0;
		this.miny = this.minmax.maxy;
		this.maxy = 0;
		this.points = new Array();
	};

	/**
	 * Method:
	 * 
	 * @param x
	 * @param y
	 * @returns {Cmouse_tracker}
	 */
	Cmouse_tracker.prototype.move = function(x, y) {
		x = cMath.clamp(Math.round(x), this.minmax.minx, this.minmax.maxx);
		y = cMath.clamp(Math.round(y), this.minmax.miny, this.minmax.maxy);
		// if (this.x == x && this.y == y) {
		// console.log('Discarding points');
		// return this;
		// }
		this.x = x;
		this.y = y;
		var callback = this.callback_exists('track');
		if (callback) {
			callback.call(this, x, y);
		}
		return this;
	};

	/**
	 * 
	 */
	Cmouse_tracker.prototype.push = function() {
		this.pushed = Date.now();
		var that = this;
		this.interval = setInterval(function() {
			if (!that.is_pushed()) {
				clearInterval(that.interval);
				return null;
			}
			if (this.paused) {
				return null;
			}
			var cp = new Cmouse_tracker_point(that);
			/* Storing our point */
			that.points.push(cp);
			that.minx = Math.min(that.minx, cp.x);
			that.maxx = Math.max(that.maxx, cp.x);
			that.miny = Math.min(that.miny, cp.y);
			that.maxy = Math.max(that.maxy, cp.y);
		}, 1000 / 120);
		if (this.func_push) this.func_push(this);
	};

	Cmouse_tracker.prototype.dom_build = function() {
		var r = $('<div />');
		r.attr('title', 'Mouse tracker');
		r.addClass('mousetracker');
		var group = document.createElement('div');
		var $g = $(group);
		$g.addClass('ui-widget-content');
		$g.append('<div class="hold-var"><h6>x:&nbsp;</h6><span class="var-x">'
				+ this.x + '</span></div>');
		$g.append('<div class="hold-var"><h6>y:&nbsp;</h6><span class="var-y">'
				+ this.y + '</span></div>');
		r.append($g);
		this.rootElm = r;
		return this;
	};

	/**
	 * 
	 */
	Cmouse_tracker.prototype.release = function() {
		this.pushed = null;
		if (this.func_release) this.func_release(this);
		this.reset();
	};

	/**
	 * @return {Boolean}
	 */
	Cmouse_tracker.prototype.is_pushed = function() {
		return this.pushed;
	};

	/**
	 * @return {String}
	 */
	Cmouse_tracker.prototype.to_s = function() {
		var str = 'Cmouse_tracker: ' + this.x + ' / ' + this.y;
		return str;
	};

	graphit.export(modulePath, Cmouse_tracker);
	
})(window, graphit, console);
