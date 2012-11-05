$(function() {
	$(this).bind("contextmenu", function(e) {
		e.preventDefault();
	});
});

var cBrush = new Cdraw_brush();
var cSurface = new Cdraw_surface('surface-01', 800, 600);
var cGrapher = new Cdraw_grapher(cBrush, cSurface);

cSurface.tools = cBrush;
$(document).ready(function() {

	var widget_brush = new Cwidget_draw_brush(cBrush);

	$('body').append(widget_brush.get_dom());
	$('body').append(cSurface.get_dom());
	$('body').append(cSurface.mouse.rootElm);

//	var layer = cSurface.get_layer();
//	var canvas = document.createElement('canvas');
//	canvas.setAttribute('width', 100);
//	canvas.setAttribute('height', 100);
//	helper_draw_circle(canvas, 50, 50, 10, 'rgb(150,0,0)');
//	console.log('Layer:');
//	console.log(layer);
//	for ( var j = 0; j <= 5; j++) {
//		for ( var i = 0; i <= 5; i++) {
//			//layer.drawImage(canvas, 0, 0, 400, 400, 10, 10);
//		}
//	}
//	var nc = layer.get_canvas();
//	// console.log(nc.toDataURL());
//	document.getElementById('surface-01').src = nc.toDataURL();
	$('.draggable').draggable({
		handle : 'h6>.header',
		snap : true,
		snapMode : 'outer',
		cancel: '.not-draggable',
	});
});