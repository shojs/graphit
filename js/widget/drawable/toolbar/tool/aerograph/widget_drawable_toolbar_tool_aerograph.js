/**
 * 
 * @param id
 * @param label
 * @returns
 */
function widget_drawable_toolbar_tool_aerograph(parent, id, label) {
	if (!parent || !id || !label) {
		console.error('widget_drawable_toolbar_tool_aerograph need id and label parameter');
		return null;
	}
	this.parent = parent;
	this.id = id;
	this.label = label;
	this.size = 1;
	this.color = 'rgba(0,0,0)';
	this._build();
	return this;
}

widget_drawable_toolbar_tool_aerograph.prototype.unselect_all = function() {
	if (this.parent) this.parent.unselect_all();
};
widget_drawable_toolbar_tool_aerograph.prototype.unselect = function() {
	this.button.unselect();
};
widget_drawable_toolbar_tool_aerograph.prototype.get_element = function() {
	return this.rootElm;
};
widget_drawable_toolbar_tool_aerograph.prototype._build = function() {
	this.button = new widget_button(this, this.id + '-aerograph', 'img/toolbar_tool_aerograph' ,this.label);
	var root = document.createElement('div');
	root.setAttribute('id', this.id);
	$(root).append(this.button.get_element());
	this.rootElm = root;
	return this;
};