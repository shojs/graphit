function widget_button (parent, id, src, label, func_push, func_release){
	if (!parent || !id || !src) {
		console.error('widget_button need id parameter');
		return null;
	}
	this.parent = parent;
	this.label = label;
	this.id = id + '-button';
	this.src_unselected = src + '_unselected.png';
	this.src_selected = src + '_selected.png';
	this.func_push = func_push;
	this.func_release = func_release;
	this.selected = false;
	this.rootElm = null;
	this.image = null;
	this._build();
	return this;
}

widget_button.prototype.select = function() {
	this.selected = true;
	this.parent.unselect_all();
	$(this.image).addClass('toolbar-tool-selected');
	this.image.src = this.src_selected;
	if (this.func_push) { this.func_push(this); }
};

widget_button.prototype.unselect = function() {
	this.selected = false;
	$(this.image).removeClass('toolbar-tool-selected');
	this.image.src = this.src_unselected;
	if (this.func_release) { this.func_release(this); }
};

widget_button.prototype.toggle = function() {
	if (this.selected) {
		this.unselect();
	} else {
		this.select();
	}
};

widget_button.prototype._build = function() {
	var that = this;
	var root = document.createElement('div');
	var img = document.createElement('img');
	this.image = img;
	img.setAttribute('src', this.src_unselected);
	img.setAttribute('title', '<h4>Tool: '+this.label+'</h4>');
	$(img).click(function() {
		that.toggle();
	});
	$(root).append(img);
	this.rootElm = root;
	return this;
};

widget_button.prototype.get_element = function() {
	return this.rootElm;
};