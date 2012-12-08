"use strict";

/*
 * Global variables
 */
//var cGraphit; /* Our main object */
//var cPo; /* Traduction */
var T; /* proxy to method Cpo.get(str) */
//var cGraphitAuth; /* Our iframe store authentication information here */

function _ok_to_build() {
   var graphit = window.graphit;
   console.log("Language", getLanguage());
//	/* Authentication */
//	cGraphitAuth = new CgraphitAuth({
//		disable : !SHOJS_AUTH
//	});
//	if (!cGraphitAuth.is_disable()) {
////		cGraphitAuth.dom_get().dialog({
////			width : 800,
////			height : 600
////		});
//	}
	/* Traduction */
	graphit.cpo = new Cpo({
		lang : getLanguage()
	});
	T = function(str) {
		return graphit.cpo.get(str);
	};

	/* Main object */
	graphit.core = new Cgraphit();
	widget_factory(graphit.core.dom_get(), {
		width : 300,
		position : 'left top'
	});

	/* Prevent right click */
	$(function() {
		$(this).bind("contextmenu", function(e) {
			e.preventDefault();
		});
	});

	/* Brush Experiment */
	var files = [
	// 'Legacy/galaxy', 'Legacy/pepper', 'Legacy/confetti',
	// 'Legacy/dunes', 'Legacy/galaxy-big', 'Media/Bristles-01',
	// 'Media/Bristles-02', 'Media/Bristles-03', 'Media/Oils-01',
	// 'Media/Oils-02', 'Media/Oils-03', 'Sketch/Charcoal-01',
	// 'Sketch/Charcoal-02', 'Sketch/Pencil-Scratch',
	// 'Splatters/Sponge-01', 'Splatters/Sponge-02', 'Texture/Cell-01',
	// 'Texture/Cell-02', 'Texture/Smoke', 'Texture/Structure',
	// 'Texture/Texture-01', 'Texture/Texture-02',
	// 'Texture/Vegetation-01',
	];

	var brush_widget = function(f) {
		f.dom_get().attr('title', '[' + f.header('bytes') + '] ' + f.name)
				.dialog({
					width : f.cCanvas.get_width(),
					height : f.cCanvas.get_height()
				});
	};

	cEach(files, function(i, file) {
		var src = 'brushes/' + file + '.gbr';
		new Cfile_GBR({
			src : src,
			callback_success : function(response) {
				console.log('[', i, '] File loaded: ' + this.src);
				brush_widget(this);
			},
			callback_error : function(response) {
				console.log('error binary file', response);
			}
		});
	});

	/* Report error when no tool are selectionned */
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
	});
}

/**
 * Executed when DOM are fully loaded We are testing browser for canvas element
 * support
 */
$(document)
		.ready(
				function() {
					/* Check if browser support HTML 5 canvas element */
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
						/* We popup a modal dialog on error */
						try {
							_ok_to_build();

						} catch (e) {
							widget_exception(e);
						}
					}

				});
