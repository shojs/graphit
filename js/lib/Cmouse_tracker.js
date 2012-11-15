/*******************************************************************************
 * Object to hold mouse position
 * 
 * @param x
 * @param y
 * @returns {Object}
 */
function Cmouse_tracker_point(x, y) {
	this.x = x;
	this.y = y;
	this.time = Date.now();
}

/*******************************************************************************
 * Tracking mouse movement
 * 
 * @author %AUTHOR
 * @param set_mouse
 * @param c_push
 * @param c_release
 * @param c_track
 * @returns
 */
function Cmouse_tracker(parent, options) {
	Cobject.call(this, options);
	this.parent = parent;

//	var callbacks = ['move', 'push', 'release', 'track'];
//	for (var i = 0; i < callbacks.length; i++) {
//		var clabel = callbacks[i];
//		if (this.callback_exists(clabel)) {
//			console.warn('Cmouse_tracker::Callback << '+clabel+' >> is undefined');
//		}		
//	}

	this.x = 0;
	this.y = 0;
	this.minmax = new Object({
		minx : 0,
		maxx : this.parent.width,
		miny : 0,
		maxy : this.parent.height,
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
	this.build();
	return this;
}

Cmouse_tracker.prototype = Object.create(Cobject.prototype);
Cmouse_tracker.prototype.constructor = new Cobject();

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
	var x = Math.round(cMath.clamp(x, this.minmax.minx, this.minmax.maxx));
	var y = Math.round(cMath.clamp(y, this.minmax.miny, this.minmax.maxy));
//	if (this.x == x && this.y == y) {
//		console.log('Discarding points');
//		return this;
//	}
//	console.log(x,y);
	this.x = x;
	this.y = y;
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
		if (this.paused) { return null;}
		var cp = new Cmouse_tracker_point(that.x, that.y);
		var lp = that.points[that.points.length - 1];
		/* We are not storing same point twice */
		if (lp && lp.x == cp.x && lp.y == cp.y) {
				return false;
		}
		/* Storing our point */
		that.points.push(cp);
		that.minx = Math.min(that.minx, cp.x);
		that.maxx = Math.max(that.maxx, cp.x);
		that.miny = Math.min(that.miny, cp.y);
		that.maxy = Math.max(that.maxy, cp.y);
	}, DRAWGLOB.graphing_interval);// * 3 /4) ;
	if (this.func_push)
		this.func_push(this);
};

Cmouse_tracker.prototype.build = function() {
	var root = document.createElement('div');
	var $r = $(root);
	$r.addClass('mousetracker draggable');
	$r.append('<h6 class="header">Mouse</h6>');
	var group = document.createElement('div');
	var $g = $(group);
	$g.addClass('not-draggable');
	$g.append('<div class="hold-var"><h6>x:</h6><div class="var-x">' + this.x
			+ '</div></div>');
	$g.append('<div class="hold-var"><h6>y:</h6><div class="var-y">' + this.y
			+ '</div></div>');
	$r.append($g);
	this.rootElm = $r;
};

Cmouse_tracker.prototype.get_dom = function() {
	return this.rootElm;
};
/**
 * 
 */
Cmouse_tracker.prototype.release = function() {
	this.pushed = null;
	if (this.func_release)
		this.func_release(this);
	this.reset();
};

/**
 * 
 * @returns
 */
Cmouse_tracker.prototype.is_pushed = function() {
	return this.pushed;
};

/**
 * 
 * @returns {String}
 */
Cmouse_tracker.prototype.to_s = function() {
	var str = 'Cmouse_tracker: ' + this.x + ' / ' + this.y;
	return str;
};
