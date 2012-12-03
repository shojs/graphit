/**
 * 11 All
 * 5 Verbose
 * 1 Normal
 */
var SHOJS_DEBUG = 1;

var E_LAYERLABEL = new Object({
current : '_current',
mouse : '_mouse',
grid : '_gris',
prefrag : '_prefrag'
});

/*******************************************************************************
 * 
 * @returns
 */
//function Cdraw_glob() {
//    this.graphing_interval = 30;
//};

//var DRAWGLOB = new Cdraw_glob();


/**
 * Little helper for popin windows
 * @param dom
 * @param options
 * @returns
 */
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
	return dom;
};

function widget_exception(e) {
	console.error('Widget', e);
	var msg = e;
	var title = '[Error] ';
	if (e instanceof Cexception_message) {
		msg = e.to_s({format: 'html'});
		title = title + e.className + '/' + e.label;
	}
	var r = $('<div title="'+title+'" />');
	r.append($('<p>'+msg+'<p/>'));
	r.dialog({
		modal: true
	});
	throw e;
}