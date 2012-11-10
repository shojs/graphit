


/**
 * 
 */
var E_LAYERLABEL = new Object({
	current : '_current',
	mouse : '_mouse',
	grid : '_gris',
	prefrag : '_prefrag',
});



$(function() {
	$(this).bind("contextmenu", function(e) {
		e.preventDefault();
	});
});

var DRAWETC = new Cetc();

var cBrush = new Cdraw_brush();
var cSurface = new Cdraw_surface('surface-01', 640, 480);
var cGrapher = new Cdraw_grapher(cBrush, cSurface);

cSurface.tools = cBrush;
$(document).ready(function() {

	var widget_brush = new Cwidget_draw_brush(cBrush);

	$('body').append(widget_brush.get_dom());
	$('body').append(cSurface.get_dom());
	//$('body').append(cSurface.mouse.rootElm);

	var cToolbox = new Cdraw_toolbox();
	cToolbox.add_tool(new Cdraw_tool_pen(cToolbox));
	cToolbox.add_tool(new Cdraw_tool_fill(cToolbox));
	cToolbox.add_tool(new Cdraw_tool_eraser(cToolbox));
	$('body').append(cToolbox.dom_get());
	$('body').append(cSurface.layer_manager.dom_get());
	var win = WM.dom_get();
	console.log(win);
	$('body').append(win);
	//$('body').append(new Clicense().dom_get());
	
	
	
	$('.draggable').draggable({
		handle : 'ui-widget-header',
		snap : true,
		snapMode : 'both',
		cancel : '.not-draggable',

	});
});