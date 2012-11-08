/**
 * 
 */
var E_LAYERLABEL = new Object({
	current : '_current',
	mouse : '_mouse',
	grid : '_gris',
	prefrag : '_prefrag',
});

function Cdraw_glob() {
	this.graphing_interval = 5;
};

var DRAWGLOB = new Cdraw_glob();

$(function() {
	$(this).bind("contextmenu", function(e) {
		e.preventDefault();
	});
});

var DRAWETC = new Cetc();

var cBrush = new Cdraw_brush();
var cSurface = new Cdraw_surface('surface-01', 800, 600);
var cGrapher = new Cdraw_grapher(cBrush, cSurface);

cSurface.tools = cBrush;
$(document).ready(function() {

	var widget_brush = new Cwidget_draw_brush(cBrush);

	$('body').append(widget_brush.get_dom());
	$('body').append(cSurface.get_dom());
	$('body').append(cSurface.mouse.rootElm);

	var cToolbox = new Cdraw_toolbox();
	cToolbox.add_tool(new Cdraw_tool_pen());
	$('body').append(cToolbox.get_dom());
	$('.draggable').draggable({
		handle : 'h6>.header',
		snap : true,
		snapMode : 'outer',
		cancel : '.not-draggable',

	});
});