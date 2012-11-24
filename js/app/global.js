/**
 * 11 All
 * 5 Verbose
 * 1 Normal
 */
var SHOJS_DEBUG = 1;



/*******************************************************************************
 * 
 * @returns
 */
function Cdraw_glob() {
    this.graphing_interval = 30;
};

var DRAWGLOB = new Cdraw_glob();

function widget_factory(dom, options) {
	this.options = options;
	var mandatory = {
		autoOpen : true,
		resizable : true,
		draggable : true,
		width : 250,
		zIndex : 10,
		dialogClass : 'shojs-dialog',
		stack : true
	};
	for ( var label in mandatory) {
		if (!(label in options)) {
			options[label] = mandatory[label];
		}
	}
	dom.dialog(options);
	// dom.resizable( "option", "disabled", true);;
	return dom;
};
