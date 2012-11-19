
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

function _ok_to_build() {
//    var $c = $('#canvas-test');
//    console.log($c.attr('width'));
//   $c.surface({
//	width : $c.attr('width'),
//	height : $c.attr('height'),
//	showTools: true,
//    });
//   var s = $c.surface();
//   $('.canvas2surface').button().click(function() {
//	console.log('click', this);
//	$(':shojs-surface').surface('close');
//	var selector = $(this).attr('selector');
//	console.log('Selector: ' + selector);
//	$(selector).dialog('open');
//    });
//    $c.surface('add_layer', 'layer 01');
//    $c.surface('add_layer', 'layer 02');
//    $c.surface('show_tools');
//    try {
//	s.surface('log', 'salut');
//    } catch (e) {
//	console.error(e, s);
//    }
    var cSurface = new Csurface('surface-01', 640, 480);
    var cToolbox = new Ctoolbox(CTOOL_tools, {
	parent : cSurface
    });
    // cSurface.cTools = cToolbox;
    var cGrapher = new Cgrapher(cToolbox, cSurface);
    
    $('#menu-top').menu({});

    $('#main-content').append(cToolbox.dom_get());

    $('#main-content').append(cSurface.layer_manager.dom_get());
    // var win = WM.dom_get();
    // $('#main-content').append(win);
    $('#main-content').append(cSurface.dom_get());

    $('#button-save').click(function() {
	cSurface.save_as_json();
    });
    $('#button-select-by-color').click(function() {
	cSurface.cCanvas.select_by_color(new Ccolor(0, 0, 0, 1));
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
    $('#group-feed-placeholder').FeedEk({
	FeedUrl : 'http://github.com/shojs/graphit/commits/gh-pages.atom',
	MaxCout : 5,
	ShowDesc : true,
	ShowPubDate : false,
    });
    $('#rss-feed').dialog({
	resizable : true,
	width : 600,
	height : 300,
    });

    $(document).tooltip({
	tooltipClass : 'tootltip-small'
    });
}
$(document)
	.ready(
		function() {
		    if (!isCanvasSupported()) {
			var $d = $(document.createElement('div'));
			$d.attr('title', 'HTML5 error');
			$d.addClass('error');
			$d
				.append('<p>Your internet browser doesn\'t support <b>canvas</b> element.'
					+ '<br><b>canvas</b> is part of HTML 5 specification'
					+ '<br> Browser who must support it are Chrome, Firefox, Safari, Opera, IE 9+'
					+ '</p>');
			$d
				.dialog({
				    modal : true,
				    close : function() {
					console.log('close');
					$('body').empty();
					document.location = 'http://github.com/shojs/graphit';
				    }

				});

		    } else {
			_ok_to_build();
		    }

		});