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
function Cmouse_tracker(set_mouse, c_push, c_release, c_track) {
	console.log('set_mouse: ' + typeof (set_mouse));
	if (typeof (set_mouse) != 'function') {
		console.error('Cmouse_trackerneed set_mouse function parameter');
		return null;
	}
	if (typeof (track) != 'function') {
		console.error('Cmouse_trackerneed track function parameter');
		return null;
	}
	this.x = 0;
	this.y = 0;
	this.func_set_mouse = set_mouse;
	this.func_track = track;
	this.func_push = push;
	this.func_release = release;
	this.pushed = null;
	this.interval = null;
	this.points = new Array();
	return this;
}

/**
 * Method:
 * 
 * @param x
 * @param y
 * @returns {Cmouse_tracker}
 */
Cmouse_tracker.prototype.set = function(x, y) {
	this.func_set_mouse(x, y);
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
		that.points.push(new Cmouse_tracker_point(that.x, that.y));
		that.func_track(that);
	}, 10);
	if (this.func_push)
		this.func_push(this);
};

/**
 * 
 */
Cmouse_tracker.prototype.release = function() {
	this.pushed = null;
	if (this.func_release)
		this.func_release(this);
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
