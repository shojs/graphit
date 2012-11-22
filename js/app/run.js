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

function _ok_to_build() {
	var files = [
			'Legacy/galaxy', 'Legacy/pepper', 'Legacy/confetti',
			'Legacy/dunes', 'Legacy/galaxy-big', 'Media/Bristles-01',
			'Media/Bristles-02', 'Media/Bristles-03', 'Media/Oils-01',
			'Media/Oils-02', 'Media/Oils-03', 'Sketch/Charcoal-01',
			'Sketch/Charcoal-02', 'Sketch/Pencil-Scratch',
			'Splatters/Sponge-01', 'Splatters/Sponge-02', 'Texture/Cell-01',
			'Texture/Cell-02', 'Texture/Smoke', 'Texture/Structure',
			'Texture/Texture-01', 'Texture/Texture-02',
			'Texture/Vegetation-01',

	];

	var brush_widget = function(f) {
		f.dom_get().attr('title', '[' + f.header('bytes') +  '] ' + f.name)
		.dialog({
			width : f.cCanvas.get_width(),
			height : f.cCanvas.get_height(),

		});
	};
//	for ( var i = 0; i < files.length; i++) {
//		var src = 'brushes/' + files[i] + '.gbr';
//		var f = new Cfile_GBR({
//			src : src,
//			callback_success : function(response) {
//				console.log('File loaded: ' + this.src);
//				brush_widget(this);
//			},
//			callback_error : function(response) {
//				console.log('error binary file', response);
//			}
//		});
//	}


	cRegistry = new Cregistry();
	var widgetWidth = 250;
	var cSurface = new Csurface('surface-01', 640, 480);

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
	// var cMetaSurface = new Cmetasurface();
	// cMetaSurface.attach_surface(cSurface);
	var widget_factory = function(dom, options) {
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

	$('#shojs-menu-top').menu({});
	widget_factory($('.shojs-menu-dialog'), {
		position : 'right'
	});

	/* TOOLBOX */
	var d_tb = widget_factory(cSurface.cToolbox.dom_get(), {
		position : 'left top'
	});
	/* LAYER MANAGER */
	widget_factory(cSurface.layer_manager.dom_get(), {
		position : {
			my : "right top",
			at : "right bottom",
			of : d_tb,
			collision : 'fit'
		}
	});
	/* SURFACE */
	widget_factory(cSurface.dom_get(), {
		width : cSurface.width + 100,
		position : 'middle middle',
		stack : false
	});
	/* THEME CHOOSER */
	var d_tc = widget_factory(new Cjquery_theme().dom_get(), {
		height : 60,
		position : 'right top'
	});

	/* GRID */
	var d_g = widget_factory(cSurface.cGrid.dom_get(), {
		position : {
			my : "right top",
			at : "right bottom",
			of : d_tc,
			collision : 'fit'
		}
	});
	/* MOUSE */
	widget_factory(cSurface.cMouse.dom_get(), {
		height : 120,
		position : {
			my : "right top",
			at : "right bottom",
			of : d_g,
			collision : 'fit'
		}
	});
	/*
	 * BUTTONS
	 */
	$('#button-save').click(function() {
		cSurface.save_as_json();
	});
	$('#button-select-by-color').click(function() {
		cSurface.cCanvas.select_by_color(new Ccolor(0, 0, 0, 1));
	});
	$('#button-about').click(function() {
		var about = new Clicense();
		widget_factory(about.dom_get(), {
			width : 600
		});

	});

	/*
	 * Prevent right click
	 */
	$(function() {
		$(this).bind("contextmenu", function(e) {
			e.preventDefault();
		});
	});

	// var b2s = function(b, i, d) {
	// var t = 0;
	//
	// if (d.t == 'utf8') {
	// var str = '';
	// console.log('Reading string: ', d.b);
	// for ( var o = 0; o < d.b; o++) {
	// //str += ''+String.fromCharCode(parseInt(b[i + o], 2));
	// str += b.charCodeAt(i+o).toString(2);
	// }
	// return str;
	// }
	// if (d.b == 4) {
	// var x = new DataView(b, i, 4);
	// //return x.getInt32(0);
	// return ((b[i] << 24) + (b[i + 1] << 16) + (b[i + 2] << 8) + (b[i + 3] <<
	// 0));
	// }
	// console.error('Dunnot know how to parse that...');
	// return null;
	// };
	// var parse = function(d) {
	// var gbr_ff = [ {
	// b : 4,
	// n : 'header_size'
	// }, {
	// b : 4,
	// n : 'version'
	// }, {
	// b : 4,
	// n : 'width'
	// }, {
	// b : 4,
	// n : 'height'
	// }, {
	// b : 4,
	// n : 'bytes'
	// }, {
	// b : 4,
	// n : 'magic_number'
	// }, {
	// b : 4,
	// n : 'spacing'
	// }, {
	// b : 'header_size',
	// n : 'name',
	// t : 'utf8'
	// }, ];
	// var a = new Uint8Array(d);
	// var bytes = 0;
	// var i = 0;
	// do {
	// console.log(i, gbr_ff[i]);
	// if (gbr_ff[i].b == 'header_size') {
	// gbr_ff[i].b = gbr_ff[0].v;
	// }
	// gbr_ff[i].v = b2s(d, bytes, gbr_ff[i]);
	// console.log(bytes, 'Value: ' + gbr_ff[i].v);
	// bytes += gbr_ff[i].b;
	// i++;
	// } while (i < a.length*4);
	// };

	// function handleFileSelect(evt) {
	// var files = evt.target.files; // FileList object
	// console.log("plop");
	// // files is a FileList of File objects. List some properties.
	// var output = [];
	// for (var i = 0, f; f = files[i]; i++) {
	// output.push('<li><strong>', escape(f.name), '</strong> (', f.type ||
	// 'n/a', ') - ',
	// f.size, ' bytes, last modified: ',
	// f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
	// '</li>');
	// }
	// document.getElementById('shojs-file-list').innerHTML = '<ul>' +
	// output.join('') + '</ul>';
	// console.log(files);
	// var file = files[0];
	// // Only process image files.
	// if (!file.type.match('image.*')) {
	// console.log("Error: you can only load file");
	// return false;
	// }
	//
	// var reader = new FileReader();
	// console.log('BOOM')
	// reader.onload = (function(theFile) {
	// return function(e) {
	// //var c = $('<canvas>');
	// var r = $('#candecoke');
	// r.empty();
	// var c = $('<canvas>');
	//
	// console.log("Loaded", e);
	// var img = $('<img />');
	// img[0].src = e.target.result;
	// c.width = img.width;
	// c.height = img.height;
	// var ctx = c[0].getContext('2d');
	// console.log('Can de coke', c);
	// width = img.width;
	// height = img.height;
	// ctx.drawImage(img[0], 0, 0, width, height);
	// ctx.drawImage(img[0], 0, 0);
	// cSurface.layer_manager.selected.drawImage(c[0], 0, 0, width, height, 0,
	// 0, width, height);
	//		   
	//		        
	// r.append(c);
	// r.append(img);
	// };
	//		  
	// }) (file);
	// //cSurface.cCanvas.load(files[0].name);
	// reader.readAsDataURL(file);
	//	      
	// }

	// document.getElementById('shojs-open-file').addEventListener('change',
	// handleFileSelect, false);
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
						_ok_to_build();
					}

				});
