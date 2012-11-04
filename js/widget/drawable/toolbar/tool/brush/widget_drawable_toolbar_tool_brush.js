

/**
 * 
 * @param id
 * @returns
 */
function widget_drawable_toolbar_tool_brush(parent, id, label) {
	if (!parent || !id || !label) {
		console.error('widget_drawable_toolbar_tool_brush need id parameter');
		return null;
	}
	this.parent = parent;
	this.id = id;
	this.label = label;
	this.size = 1;
	this.color = 'rgba(0,0,0)';
	this.button = null;
	this._build();

	return this;
}

widget_drawable_toolbar_tool_brush.prototype.unselect = function() {
	this.button.unselect();
};

widget_drawable_toolbar_tool_brush.prototype.unselect_all = function() {
	if (this.parent) this.parent.unselect_all();
};

widget_drawable_toolbar_tool_brush.prototype.get_element = function() {
	return this.rootElm;
};
widget_drawable_toolbar_tool_brush.prototype._build = function() {
	var that = this;
	this.button = new widget_button(this, this.id + '-button', 'img/toolbar_tool_brush', this.label,
			function() { 
				console.log('Push');
				that._build_options();
			},
			function() { console.log('Release');}
	);
	var root = document.createElement('div');
	root.setAttribute('id', this.id);
	$(root).append(this.button.get_element());
	this.rootElm = root;
	return this;
};

widget_drawable_toolbar_tool_brush.prototype._build_options = function() {
	var $root = $(this.rootElm).parent().parent().children('.options');
	$root.empty();
	console.log($root);
	var slider = new widget_drawable_toolbar_option_size(this, 'id', null);
	$root.append(slider.get_element());
};
