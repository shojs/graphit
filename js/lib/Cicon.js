function Cicon(options) {
	options = options || {};
	options.className = 'Cicon';
	options.size = options.size || 22;
	options.type = options.type || 'gimp';
	options.format = options.format || 'png';
	options.label = options.label || 'icon';
	options.path = options.path? '/' + options.path + '/': '/';
	options.src = this._build_src_path(options);
	Cimage.call(this, options, ['name', 'format', 'size', 'path'] );
}

Cicon.prototype = Object.create(Cimage.prototype);
Cicon.prototype.constructor = new Cimage();


Cicon.prototype._build_src_path = function(options) {
	if (!options.name) this.exception('mandatory_parameter_missing', 'name');
	return 'images/' + options.type +  options.path  + options.name + '-' + options.size + '.' + options.format;
};
