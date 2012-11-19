function Cminmax(min, max) {
    this.min = min;
    this.max = max;
    this.last = null;
};
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
}

/*******************************************************************************
 * Object to hold mouse position
 * 
 * @param x
 * @param y
 * @returns {Object}
 */
function Cmouse_tracker_point(x, y) {
    	Cvector2d.call(this, x, y);
	this.x = x;
	this.y = y;
	this.time = Date.now();
}

Cmouse_tracker_point.prototype = Object.create(Cvector2d.prototype);
Cmouse_tracker_point.prototype.constructor = new Cvector2d(0,0,0);
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
function Cmouse_tracker(options) {
	Cobject.call(this, options, ['parent', 'callback_move', 'callback_track']);

	this.x = 0;
	this.y = 0;
	this.cMinmaxX = new Cminmax(0, this.parent.width);
	this.cMinmaxY = new Cminmax(0, this.parent.height);
	
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
	this.dom_get();
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
	x = cMath.clamp(Math.round(x), this.minmax.minx, this.minmax.maxx);
	y = cMath.clamp(Math.round(y), this.minmax.miny, this.minmax.maxy);
//	if (this.x == x && this.y == y) {
//		console.log('Discarding points');
//		return this;
//	}
	this.x = x;
	this.y = y;
	if ('callback_track' in this) {
	    this.callback_track.call(this, x, y);
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
		if (this.paused) { return null;}
		var cp = new Cmouse_tracker_point(that.x, that.y);
		var lp = that.points[that.points.length - 1];
		/* We are not storing same point twice */
//		if (lp && lp.x == cp.x && lp.y == cp.y) {
//				return false;
//		}
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

Cmouse_tracker.prototype.dom_build = function() {
    	var r = $('<div />');
    	r.attr('title', 'Mouse tracker');
	r.addClass('mousetracker');
	var group = document.createElement('div');
	var $g = $(group);
	$g.addClass('group not-draggable');
	$g.append('<div class="hold-var"><h6>x:&nbsp;</h6><span class="var-x">' + this.x
			+ '</span></div>');
	$g.append('<div class="hold-var"><h6>y:&nbsp;</h6><span class="var-y">' + this.y
			+ '</span></div>');
	r.append($g);
	r.dialog({width: 150, height: 150});
	this.rootElm = r;
	return this;
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
