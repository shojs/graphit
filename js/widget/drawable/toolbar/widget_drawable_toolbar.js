

/**
 * 
 * CLASS Holding drawable area toolbar
 * @param < id >
 * @return Newly created object
 */
function widget_drawable_toolbar(id) {
	if (!id) {
		console.error('widget_drawable_toolbar constructor need id parameter');
		return null;
	}
	this.id = id;
	this.rootElm = null;
	this.tools = null;
	this.tools = new Array();
	this.color = null;
	this.size = null;
	this._build();
	return this;
}

widget_drawable_toolbar.prototype.unselect_all = function() {
	for (var i = 0; i < this.tools.length ; i++) {
		this.tools[i].unselect();
	}
};
widget_drawable_toolbar.prototype._build = function() {
	this.tools.push(new widget_drawable_toolbar_tool_brush(this, this.id + '-brush', LANG['brush']));
	this.tools.push(new widget_drawable_toolbar_tool_aerograph(this, this.id + '-aerograph', LANG['aerograph']));
	var tools = new widget_drawable_toolbar_tools(this.id + '-tools');
	var root = document.createElement('div');
	root.setAttribute('id', this.id);
	$(root).addClass('drawable-toolbar');
	$(root).append('<h5 class="interaction-draggable" title="click to move"></h5>');
	for (var i = 0; i < this.tools.length ; i++) {
		var tool = this.tools[i];
		$(tools.rootElm).append(tool.get_element());
	}
	$(root).append(tools.get_element());
	$(root).draggable( { handle: 'h5', delay: 50 });
	console.log('ID: ' + this.id);
	this.color = new widget_drawable_toolbar_color(this, this.id + '-colorpicker', LANG['colorpicker']);
	$(root).append(this.color.get_element());
	var options = document.createElement('div');
	$(options).addClass('options');
	$(root).append(options);
//	this.size = new widget_drawable_toolbar_option_size(this, this.id + '-option-size');
//	$(root).append(this.size.get_element());
	this.rootElm = root;
	return this;
};

widget_drawable_toolbar.prototype.inject = function(tElm) {
	$(tElm).append(this.rootElm);
};

widget_drawable_toolbar.prototype.get_element = function() {
	return this.rootElm;
};