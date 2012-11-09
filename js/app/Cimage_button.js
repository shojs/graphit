function Cimage_button(options) {
	this.stay_selected = true;
	this.selected = false;
	this.options = options;
	this.rootElm = null;
	this.errorMsg = '';
	if (this.invalid_options()) {
		console.error("Invalid option" + this.errorMsg);
		return null;
	}
	return this;
}

Cimage_button.prototype.invalid_options = function() {
	var ret = false;
	this.errorMsg = '';
	if (!this.options.src) {
		this.errorMsg  += "Missing src option\n";
		ret = true;
	}
	return ret;
};


Cimage_button.prototype.dom_build = function() {
	var that = this;
	var root = document.createElement('div');
	var $r = $(root);
	$r.addClass('button');
	for (opt in this.options.css) {
		console.log('css: ', opt);
		$r.css(opt, this.options.css[opt]);
	}
	var img = document.createElement('img');
	var $i = $(img);
	this.image = img;
	if (this.options.width) $i.attr('width', this.options.width);
	if (this.options.height) $i.attr('height', this.options.height);
	img.src = this.options.src;
	$i.attr('alt',this.options.label);	
	$i.button({});
	$i.click(function() {
		console.log('---- click');
		if (that.options.click) {
			that.options.click(this);
		}
	});
	$r.append(img);

	this.rootElm = $r;
	return this;
};


Cimage_button.prototype.dom_get = function() {
	return this.dom_build().rootElm;
}