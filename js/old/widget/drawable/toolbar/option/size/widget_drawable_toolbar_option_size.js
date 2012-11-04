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
	this.slider = null;
	this._build();
	return this;
}

widget_drawable_toolbar_option_size.prototype._build = function() {
	var root = document.createElement('div');
	root.setAttribute('id', this.id);
	root.setAttribute('title', "Move to change size")
	$(root).addClass('size component-slider');
	$(root).append("<h6 class='label'>size</h6>");
	var input = document.createElement('input');
	input.setAttribute('value', 20);
	$(input).addClass('input');
	$(root).append(input);
	var slider = document.createElement('div');
	$(slider).addClass('slider');
	var $s = $(slider).slider({min: 0, max: 80, step: 1, value:20,
		slide: function(e, ui) {
			var $input = $(this).parent().children('.input');
			$(input).attr('value', ui.value);
		},
	}); 
	this.slider = slider;
	$(root).append(slider);

	this.rootElm = root;
};

widget_drawable_toolbar_option_size.prototype.get_size = function() {
	return $(this.rootElm).slider('option', 'value');
};

widget_drawable_toolbar_option_size.prototype.inject = function(tElm) {
	$(tElm).append(this.rootElm);
};

widget_drawable_toolbar_option_size.prototype.get_element = function() {
	return this.rootElm;
};
