/**
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

/**
 * Tracking mouse movement
 * 
 * @author %AUTHOR
 * @param set_mouse
 * @param c_push
 * @param c_release
 * @param c_track
 * @returns
 */
function Cmouse_tracker(c_move, c_push, c_release, c_track) {
	if (typeof (c_move) != 'function') {
		console.error('Cmouse_trackerneed set_mouse function parameter');
		return null;
	}
	this.x = 0;
	this.y = 0;
	this.minmax = new Object({
		minx: 0, maxx: 400,
		miny: 0, maxy: 400,
	});
	this.func_move = c_move;
	this.func_push = c_push;
	this.func_release = c_release;
	this.func_track = c_track;
	this.pushed = null;
	this.interval = null;
	this.points = new Array();
	this.rootElm = null;
	this.build();
	return this;
}

/**
 * Method:
 * 
 * @param x
 * @param y
 * @returns {Cmouse_tracker}
 */
Cmouse_tracker.prototype.move = function(x, y) {
	this.x = helper_bound_value(x, this.minmax.minx, this.minmax.maxx);
	this.y = helper_bound_value(y, this.minmax.miny, this.minmax.maxy);
	//console.log('move: ' + this.x + ' / ' + this.y);
	this.func_move(this.x, this.y);
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
		var x = that.x;
		var y = that.y;
		//console.log(that);
		that.points.push(new Cmouse_tracker_point(x, y));
		that.func_track(that, x, y);
	}, 10);
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
	$g.css('display', 'block');
	$g.append('<div class="hold-var">x:&nbsp;<div class="var-x">' + this.x + '</div></div>');
	$g.append('<div class="hold-var">y:<div class="var-y">' + this.y + '</div></div>');
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
	console.log('Recorded points: ' + this.points.length);
	this.points = new Array();
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
