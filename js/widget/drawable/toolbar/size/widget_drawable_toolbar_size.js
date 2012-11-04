/**
 * 
a * CLASS Holding drawable area toolbar tools
 * @param < id >
 * @return Newly created object
 */
function widget_drawable_toolbar_option_size(parent, id, lang) {
	if (!id) {
		console.error('widget_drawable_toolbar constructor need id parameter');
		return null;
	}
	this.id = id;
	this.rootElm = null;
	this._build();
	return this;
}

widget_drawable_toolbar_color.prototype._build = function() {
	var root = document.createElement('div');
	root.setAttribute('id', this.id);
	$(root).append('<h5>color picker</h5>');
	var colorpicker = document.createElement('input');
	colorpicker.setAttribute('value', 'FFFFFF');
	colorpicker.setAttribute('type', 'text');
	colorpicker.setAttribute('id', this.id + '-input');
	$(colorpicker).addClass('colorpickerinput');
	console.log('colorpicker: ' + this.id);
	$(colorpicker).ready(function() { $(colorpicker).jPicker(); });
	$(root).append(colorpicker);
	this.rootElm = root;
};

widget_drawable_toolbar_color.prototype.inject = function(tElm) {
	$(tElm).append(this.rootElm);
};

widget_drawable_toolbar_color.prototype.get_element = function() {
	return this.rootElm;
};
