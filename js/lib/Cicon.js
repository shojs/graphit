function Cicon(options) {
	options = options || {};
	options.className = 'Cicon';
	options.size = 32;
	options.iconSet = 'gnome';
	options.label = options.label || 'icon';
	if (src in options && options.src) {
		options.src = this._build_src_path(options.src);
		console.log('Loading icon', options.src);
	}
	Cimage.call(this, options);
}

Cicon.prototype = Object.create(Cimage.prototype);
Cicon.prototype.constructor = new Cimage();

Cicon.prototype._build_src_path = function(src) {
	return 'img/icons/' + this.iconSet + '/' + this.size + 'x' + this.size + '/' + src;
}