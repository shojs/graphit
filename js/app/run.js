function helper_format_number_length(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

function Cuid() {
	this.num_created = 0;
	this.prefix = 'sho';
	this.id = null;
	this.init();
}

Cuid.prototype.get_frag = function() {
	var max = 65535;
	var i = Math.round(Math.random()*Date.now()/(max*10));
	var txt = i + '';
	i = parseInt(txt.slice(0,5));
	return helper_format_number_length(i, 5);
};

Cuid.prototype.get = function() {
	var str = this.prefix + '-';
	for (var i = 0; i < 4; i++) {
		str += this.get_frag() + '-';
	}
	str += 'uid';
	this.num_created++;
	console.log(this.num_created, 'Created UID', str);
	return str;
};

Cuid.prototype.init = function() {
	this.id = this.get();
	console.log('id: ' + this.id);
};

var UID = new Cuid();

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
	this.graphing_interval = 10;
};

var DRAWGLOB = new Cdraw_glob();

$(function() {
	$(this).bind("contextmenu", function(e) {
		e.preventDefault();
	});
});

var DRAWETC = new Cetc();

var cBrush = new Cdraw_brush();
var cSurface = new Cdraw_surface('surface-01', 640, 480);
var cGrapher = new Cdraw_grapher(cBrush, cSurface);

cSurface.tools = cBrush;
$(document).ready(function() {

	var widget_brush = new Cwidget_draw_brush(cBrush);

	$('body').append(widget_brush.get_dom());
	$('body').append(cSurface.get_dom());
	$('body').append(cSurface.mouse.rootElm);
	$('body').append(cSurface.layer_manager.dom_get());
	var cToolbox = new Cdraw_toolbox();
	cToolbox.add_tool(new Cdraw_tool_pen());
	$('body').append(cToolbox.get_dom());
	$('body').append(new Clicense().dom_get());
	
	
	
	$('.draggable').draggable({
		handle : 'h6>.header',
		snap : true,
		snapMode : 'outer',
		cancel : '.not-draggable',

	});
});