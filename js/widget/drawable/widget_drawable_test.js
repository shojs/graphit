//var component = new widget_drawable(GLOB.id_generator.get());
//GLOB.add_component(component);

$(function() {
//    $(this).bind("contextmenu", function(e) {
//        e.preventDefault();
//    });
}); 
var cBrush = new Cdraw_brush();
var cSurface = new Cdraw_surface(400, 400);
$(document).ready(function() {
	//GLOB.test_all();
	//$( document ).tooltip();
	
	//var timg = document.getElementById('brush-preview');
	//cBrush.drawing(timg, 0,0);
	var widget = new Cwidget_draw_brush(cBrush);
	
	$('body').append(widget.get_dom());

	var layer = cSurface.get_layer();
	var canvas = document.createElement('canvas');
	canvas.setAttribute('width', 100);
	canvas.setAttribute('height', 100);
	helper_draw_circle(canvas, 50, 50, 10, 'rgb(150,0,0)');
	console.log('Layer:');
	console.log(layer);
	for (var j = 0; j < 10; j++) {
		for (var i = 0; i < 10; i++) {
			layer.drawImage(canvas, 0,0, 400, 400, i*10, j*10);
		}
	}
	var nc = layer.get_canvas();
	//console.log(nc.toDataURL());
	document.getElementById('surface-01').src = nc.toDataURL();
	$('.draggable').draggable({handle: 'h6>.header', snap: true, snapMode: 'outer'});
});