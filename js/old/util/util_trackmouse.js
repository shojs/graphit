function util_trackmouse_point (x, y) {
	this.x = x;
	this.y = y;
}

function util_trackmouse (set_mouse, push, release, track) {
	console.log('set_mouse: ' + typeof(set_mouse));
	if (typeof(set_mouse) != 'function') {
		console.error('util_trackmouse need set_mouse function parameter');
		return null;
	}
	if (typeof(track) != 'function') {
		console.error('util_trackmouse need track function parameter');
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

util_trackmouse.prototype.set = function(x, y) {
	this.func_set_mouse(x, y);
};

util_trackmouse.prototype.push = function() {
	this.pushed = Date.now();
	var that = this;
	this.interval = setInterval(function() {
		//that.points = new Array();
		if (!that.is_pushed()) {
			clearInterval(that.interval);
			return null;
		}
		
		that.points.push(new util_trackmouse_point(that.x, that.y));
		that.func_track(that);
	}, 10);
	if (this.func_push) this.func_push(this);
};

util_trackmouse.prototype.release = function() {
	this.pushed = null;
	if (this.func_release) this.func_release(this);
	this.points = new Array();
	
};

util_trackmouse.prototype.is_pushed = function() {
	return this.pushed;
};

util_trackmouse.prototype.to_s = function() {
	var str = 'util_trackmouse: ' + this.x + ' / ' + this.y;
	return str;
};



