
/**
 * 
 */
var E_LAYERLABEL = new Object({
    current : '_current',
    mouse : '_mouse',
    grid : '_gris',
    prefrag : '_prefrag',
});


var cRegistry;

function _ok_to_build() {
    cRegistry = new Cregistry();
    var widgetWidth = 250;
    var cSurface = new Csurface('surface-01', 640, 480);
    var cToolbox = new Ctoolbox(CTOOL_tools, {
	parent : cSurface
    });
    var cGrapher = new Cgrapher(cToolbox, cSurface);
    $(document).bind('shojs-error', function(e, d) {
	if (d != 'no-tool-selectionned') { return false; }
	var t = $('<div class="dialog-error" title="Select tool first!">');
	t.append('<p>You must select a tool before drawing onto surface</p>');
	t.dialog({
	    modal: true,
	    resizable: false,
	    buttons: {
		Ok: function() {
		    $(this).dialog('close');
		}
	    },
	});
	//alert('You must first select a tool in toolbar');
    });
//    var cMetaSurface = new Cmetasurface();
//    cMetaSurface.attach_surface(cSurface);
    
    $('#shojs-menu-top').menu({});
    $('.shojs-menu-dialog').dialog({ autoOpen: true, resizable: true, draggable: true, width: 250, zIndex: 0, position: 'left', dialogClass: 'shojs-dialog'});
    var diag_s = cSurface.dom_get().dialog({autoOpen: true, resizable: true, draggable: true, width: cSurface.width + 100, zIndex:1, position: 'middle top', stack: false, dialogClass: 'shojs-dialog'});
    var diag_t = cToolbox.dom_get().dialog({autoOpen: true, resizable: true, draggable: true, width: widgetWidth, zIndex: 0,position: 'left top', dialogClass: 'shojs-dialog'});
    var diag_lm = cSurface.layer_manager.dom_get().dialog({autoOpen: true, resizable: true, draggable: true, width: widgetWidth, zIndex: 0, position: { offset: '0 10', my: "left top", at: "right top", of: diag_s }, dialogClass: 'shojs-dialog'});
    var diag_mt= cSurface.cMouse.dom_get().dialog({autoOpen: true, resizable: true, draggable: true, width: widgetWidth, zIndex: 0, position: { offset: '0 10', my: "left top", at: "bottom left", of: diag_lm }, dialogClass: 'shojs-dialog'});
    
      
    var diag_tc = new Cjquery_theme().dom_get().dialog({autoOpen: true, resizable: true, draggable: true, width: widgetWidth, zIndex: 0, position: { offset: '0 10', my: "left top", at: "bottom left", of: diag_lm }, dialogClass: 'shojs-dialog'});
   
    var diag_g = cSurface.cGrid.dom_get().dialog({autoOpen: true, resizable: true, draggable: true, width: widgetWidth, zIndex: 0, position: { offset: '0 15', my: "left top", at: "left bottom", of: diag_t }, dialogClass: 'shojs-dialog'});;

    $('.shojs-dialog').resizable({
	autoHide: true,
    });
    
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
    $(function() {
	    $(this).bind("contextmenu", function(e) {
		e.preventDefault();
	    });
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