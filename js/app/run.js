

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

var cRegistry = new Cregistry();

$(document).ready(function() {
	var cToolbox = new Ctoolbox(CTOOL_tools);
	var cSurface = new Csurface('surface-01', 800, 600);
	cSurface.cTools = cToolbox;
	var cGrapher = new Cgrapher(cToolbox, cSurface);

	$('body').append(cToolbox.dom_get());
	$('body').append(cSurface.get_dom());

	$('body').append(cSurface.layer_manager.dom_get());
	var win = WM.dom_get();
	console.log(win);
	$('body').append(win);
	
	$('.draggable').draggable({
		handle : 'ui-widget-header',
		snap : true,
		snapMode : 'both',
		cancel : '.not-draggable',

	});
});