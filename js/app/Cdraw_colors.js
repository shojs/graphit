function Cdraw_colors(color) {
	if (color && !(color instanceof Ccolor)) {
		console.error('first parameter Ccolor is missing');
		return null;
	}
	if (this.color) {
		this.color = color;
	} else {
		this.color = new Ccolor(255,255,255,1);
	}
}

Cdraw_colors.prototype.dom_build = function() {
	var root = document.createElement('div');
	var $r = $(root);
	$r.addClass('color');
	var color = document.createElement('div');
	var $c = $(color);
	$c.addClass('picker');
	$r.append($c);
	this.rootElm = $r;
	return this;
};

Cdraw_colors.prototype.dom_get = function() {
	return this.dom_build().rootElm;
};