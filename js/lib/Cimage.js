var Eloading_status = {
		none: 1,
		loading: 2,
		fail: 3,
		ok: 4,
};

function Cimage(options) {
    	options.className = 'Cimage';
    	options.label = 'image';
	Cobject.call(this, options, []) ;
	this.options = options;
	this.data = null;
	this.status = Eloading_status.none;
	this.errorMsg = '';
	this.last_update = null;
	this.is_pushed = false;
	this.dom_get();
}

Cimage.prototype = Object.create(Cobject.prototype);
Cimage.prototype.constructor = new Cobject();

Cimage.prototype.dom_build = function(p_src, force) {
	var that = this;
	var opt = this.options;
	if (this.rootElm && !force) {
		console.warn('Image already loaded');
		return this;
	}
	var src = p_src;
	if ('src' in opt && opt.src) { src = opt.src; }
	if (!src) {
		console.warn('No source for image');
		return false;
	}
	var img = $('<img/>');
	img.onload = function() { that.callback_onload(); };
	img.onerror = function() { that.callback_onerror(); };
//	console.log(opt);
	if ('label' in opt && opt.label != undefined) {
		img.attr('alt', this.options.label);
		img.attr('title', this.options.label);
	}
	if ('width' in opt && opt.width != undefined) {
		//console.log('set width', opt.width);
		img.attr('width', opt.width);
	}
	if ('height' in opt && opt.height != undefined) {
		img.attr('height', opt.height);
	}
	if ('src' in opt && opt.src) {
		img.attr('src', opt.src);
	}
	img.click(function() { that.callback_click(); });
	this.rootElm = img;
	return this;
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
		if (!this.options.callback_onload.call(this, this)) { 
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


