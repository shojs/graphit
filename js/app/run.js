

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
	//cSurface.cTools = cToolbox;
	var cGrapher = new Cgrapher(cToolbox, cSurface);
	$('#menu-top').menu({  });

	$('#main-content').append(cToolbox.dom_get());


	$('#main-content').append(cSurface.layer_manager.dom_get());
//	var win = WM.dom_get();
	//$('#main-content').append(win);
	$('#main-content').append(cSurface.get_dom());	

	$('#button-save').click(function() {
		cSurface.save_as_json();
	});
	$('#button-about').click(function() {
	    var about = new Clicense();
	    var dom = about.dom_get();
	    $('body').append(dom);
	});
	$('.draggable').draggable({
		handle : 'ui-widget-header',
		snap : true,
		snapMode : 'both',
		cancel : '.not-draggable',

	});
	$(document).tooltip({tooltipClass: 'tootltip-small'});
});