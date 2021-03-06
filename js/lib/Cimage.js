var Eloading_status = {
	none : 1,
	loading : 2,
	fail : 3,
	ok : 4
};

/**
 * A html image element
 * @param options Cobject hash arguments
 * @return {Cimage} Cimage instance
 */
function Cimage(options) {
	options = options || {};
	options.className = 'Cimage';
	options.label = options.label || 'image';
	Cobject.call(this, options, [
			'parent', 'src', 'width', 'height', 'title', 'callback_click', 'callback_success', 'callback_error', 'autoRelease'
	]);
	this.options = options;
	this.data = null;
	this.status = Eloading_status.none;
	this.errorMsg = '';
	this.last_update = null;
	if (!this.src) {
		console.warn(this.className + ' constructed without src argument');
	}
	this.dom_get();
}

Cimage.prototype = Object.create(Cobject.prototype);
Cimage.prototype.constructor = new Cobject();

/**
 * Build our DOM element, storing it in this.rootElm
 * @return {Cimage} This
 */
Cimage.prototype.dom_build = function() {
	var that = this;
	if (this.rootElm && !force) {
		console.warn('Image already loaded');
		return this;
	}
	var img = $('<img />');
	img[0].onload = function() {
		return that.callback_onload.call(that);
	};
	img[0].onerror = function() {
		return that.callback_onerror.call(that);
	};
	img.click(function(){
		return that.callback_click.call(that);
	});
	// console.log(opt);
	if ('label' in this && this.label != undefined) {
		img.attr('alt', this.label);
		img.attr('title', this.label);
	}
	if ('width' in this && this.width != undefined) {
		img.attr('width', this.width);
	}
	if ('height' in this && this.height != undefined) {
		img.attr('height', this.height);
	}
	if ('src' in this && this.src) {
		img.attr('src', this.src);
	}
	this.rootElm = img;
	return this;
};

/**
 * @returns {Boolean}
 */
Cimage.prototype.callback_onload = function() {
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
	var callback = this.callback_exists('success');
	if (callback) {
		return callback.call(this);
	}
	return false;
};

/**
 * @returns {Boolean}
 */
Cimage.prototype.callback_onerror = function() {
	this.status = Eloading_status.fail;
	this.last_update = null;
	var callback = this.callback_exists('error');
	if (callback) {
		return callback.call(this);
	}	
	return false;
};

/**
 * @returns {Boolean}
 */
Cimage.prototype.callback_click = function() {
	var callback = this.callback_exists('click');
	if (callback) {
		return callback.call(this);
	}
	return false;
};
