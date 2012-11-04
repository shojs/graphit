/**
 * 
a * CLASS Holding drawable area toolbar tools
 * @param < id >
 * @return Newly created object
 */
function widget_drawable_toolbar_tools(id) {
	if (!id) {
		console.error('widget_drawable_toolbar constructor need id parameter');
		return null;
	}
	this.id = id;
	this.rootElm = null;
	this._build();
	return this;
}

widget_drawable_toolbar_tools.prototype._build = function() {
	var root = document.createElement('div');
	root.setAttribute('id', this.id);
	//$(root).append('<h6></h6>');
	this.rootElm = root;
};

widget_drawable_toolbar_tools.prototype.inject = function(tElm) {
	$(tElm).append(this.rootElm);
};

widget_drawable_toolbar_tools.prototype.get_element = function() {
	return this.rootElm;
};