var Eloading_status = {
		none: 1,
		loading: 2,
		fail: 3,
		ok: 4,
};

function Cimage(options) {
	Cobject.call(this);
	this.options = options;
	this.data = null;
	this.status = Eloading_status.none;
	this.errorMsg = '';
	this.last_update = null;
	this.is_pushed = false;
	this.load();
}

Cimage.prototype = Object.create(Cobject.prototype);
Cimage.prototype.constructor = new Cobject();

Cimage.prototype.load = function(p_src, force) {
	var that = this;
	var opt = this.options;
	if (this.data && !force) {
		console.warn('Image already loaded');
		return true;
	}
	var src = p_src;
	if ('src' in opt && opt.src) { src = opt.src; }
	if (!src) {
		console.warn('No source for image');
		return false;
	}
	var img = document.createElement('img');
	img.onload = function() { that.callback_onload(); };
	img.onerror = function() { that.callback_onerror(); };
	if ('label' in opt && opt.label != undefined) {
		img.setAttribute('alt', this.options.label);
		img.setAttribute('title', this.options.label);
	}
	if ('width' in this.options && this.options.width != undefined) {
		img.setAttribute('width', this.options.width);
	}
	if ('height' in this.options && this.options.height != undefined) {
		img.setAttribute('height', this.options.height != undefined);
	}
	if ('src' in this.options && this.options.src) {
		img.setAttribute('src', this.options.src);
	}
	this.data = img;
	return true;
};

Cimage.prototype.callback_onload = function() {
	var ret = true;
	this.status = Eloading_status.ok;
	this.last_update = Date.now();
	if ('replace_id' in this.options && this.options.replace_id) {
		var e = document.getElementById(this.options.replace_id);
		if (!e) {
			this.errorMsg = 'Replacing image failed';
			ret = false;
		} else {
			if ('label' in this.options) {
				e.setAttribute('alt');
			}
			e.width = this.data.width;
			e.height = this.data.height;
			e.src = this.data.src;
		}
	}
	if ('callback_onload' in this.options && typeof(this.options.callback_onload) === 'function') {
		if (!this.options.callback_onload(this)) { 
			this.errorMsg += 'Error while calling onload callback';
			ret = false;
		}
	}
	return ret;
};

Cimage.prototype.callback_onerror = function() {
	var ret = true;
	this.status = Eloading_status.fail;
	this.last_update = null;
	if ('callback_onerror' in this.options && typeof(this.options.callback_onerror) === 'function') {
		if (!this.options.callback_onerror(this)) { 
			this.errorMsg += 'Error while calling onerror callback';
			ret = false;
		}
	}
	return ret;
};

Cimage.prototype.callback_click = function() {
	var ret = true;
	if (this.options.auto_release) {
		this.is_pushed = false;
	} else {
		if (this.is_pushed) {this.is_pushed = false; }
		else { this.is_pushed = true; }
	}
	if ('callback_click' in this.options && typeof(this.options.callback_click) === 'function') {
		//console.log('Calling callback', this);
		if (!this.options.callback_click.call(this, this)) { 
			this.errorMsg += 'Error while calling click callback';
			ret = false;
		}
	}
	return ret;
};


Cimage.prototype.dom_build = function() {
	var that = this;
	var img = document.createElement('img');
	img.src = this.options.src;
	var $i = $(img);
	$i.click(function() { that.callback_click(); });
	this.rootElm = $(img);
	return this;
};



