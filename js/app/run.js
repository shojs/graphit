/**
 * 
 */
var E_LAYERLABEL = new Object({
	current : '_current',
	mouse : '_mouse',
	grid : '_gris',
	prefrag : '_prefrag'
});

var cRegistry;
var cGraphit;

function _ok_to_build() {
	cRegistry = new Cregistry();
	cGraphit = new Cgraphit();
	//cGraphit.widget_new_surface();
	widget_factory(cGraphit.dom_get(), { width: 100});
//$('#shojs-menu-top').menu({});
//	widget_factory($('.shojs-menu-dialog'), {
//		position : 'left top',
//		width: 100
//	});
	/*
	 * BUTTONS
//	 */
//	$('#button-save').click(function() {
//		cSurface.save_as_json();
//	});
//	$('#button-select-by-color').click(function() {
//		cSurface.cCanvas.select_by_color(new Ccolor(0, 0, 0, 1));
//	});
//	$('#button-about').click(function() {
//		var about = new Clicense();
//		widget_factory(about.dom_get(), {
//			width : 600
//		});
//
//	});

	/*
	 * Prevent right click
	 */
	$(function() {
		$(this).bind("contextmenu", function(e) {
			e.preventDefault();
		});
	});
	//return;
	var files = [
//			'Legacy/galaxy', 'Legacy/pepper', 'Legacy/confetti',
//			'Legacy/dunes', 'Legacy/galaxy-big', 'Media/Bristles-01',
//			'Media/Bristles-02', 'Media/Bristles-03', 'Media/Oils-01',
//			'Media/Oils-02', 'Media/Oils-03', 'Sketch/Charcoal-01',
//			'Sketch/Charcoal-02', 'Sketch/Pencil-Scratch',
//			'Splatters/Sponge-01', 'Splatters/Sponge-02', 'Texture/Cell-01',
//			'Texture/Cell-02', 'Texture/Smoke', 'Texture/Structure',
//			'Texture/Texture-01', 'Texture/Texture-02',
//			'Texture/Vegetation-01',
	];

	var brush_widget = function(f) {
		f.dom_get().attr('title', '[' + f.header('bytes') +  '] ' + f.name)
		.dialog({
			width : f.cCanvas.get_width(),
			height : f.cCanvas.get_height(),

		});
	};
	cEach(files, function(i, file) {
		var src = 'brushes/' + file + '.gbr';
		new Cfile_GBR({
			src : src,
			callback_success : function(response) {
				console.log('[',i,'] File loaded: ' + this.src);
				brush_widget(this);
			},
			callback_error : function(response) {
				console.log('error binary file', response);
			}
		});
	});



	var widgetWidth = 250;
	//var cSurface = new Csurface({label: 'surface-01', width: 640, height: 480});

	$(document).bind('shojs-cgrapher-grapher-error', function(e, d) {
		console.log('bind', e, d);
		if (d != 'no-tool-selectionned') {
			return false;
		}
		var t = $('<div class="dialog-error" title="Select tool first!">');
		t.append('<p>You must select a tool before drawing onto surface</p>');
		t.dialog({
			modal : true,
			resizable : false,
			buttons : {
				Ok : function() {
					$(this).dialog('close');
				}
			}
		});
		// alert('You must first select a tool in toolbar');
	});
}
/**
 * Executed when dom are fully loaded We are testing browser for canvas element
 * support
 */
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
										+ '<br> Browser who must support it are Chrome, Firefox, Safari'
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
						// We popup a modal dialog on error
						try { 
							_ok_to_build();
							
						} catch(e) {
							console.log(e);
							var msg = e;
							var r = $('<div title="Error" />');
							r.append($('<p>'+msg+'<p/>'));
							r.dialog({
								modal: true
							});
							throw e;
						}
					}

				});
