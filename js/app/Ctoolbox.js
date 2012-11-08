function Cdraw_tool(ptype) {
	this.type = null;
	this.init(ptype);
};

Cdraw_tool.prototype.init = function(ptype) {
	console.log('Init object: ' + typeof (this));
	this.type = ptype;
};

function Cdraw_tool_pen() {
	Cdraw_tool.call(this, 'pen');
}

Cdraw_tool_pen.prototype = Object.create(Cdraw_tool.prototype);
Cdraw_tool_pen.prototype.constructor = new Cdraw_tool();
	

function Cdraw_toolbox() {
	this.selected_tool = null;
	this.tools = new Array();
	this.preview = null;
	this.options = null;
	this.rootElm = null;
	this.build();
}

Cdraw_toolbox.prototype.add_tool = function(cTool) {
	console.log("Adding tool: " + cTool.type);
	this.tools.push(cTool);
};

Cdraw_toolbox.prototype.build = function() {
	var root = document.createElement('div');
	var $r = $(root);
	$r.append('<h6>Toolbox</h6>');
	$r.addClass('draggable toolbox');
	for (var i = 0; i < this.tools.length; i++) {
		$r.append('<p>'+ this.tools[i].type + '</p>');
	}
	this.rootElm = root;
};

Cdraw_toolbox.prototype.get_dom = function() {
	return this.rootElm;
};
