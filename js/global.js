var LANG_EN = new Object();
LANG_EN['brush'] = "Brush";
LANG_EN['aerograph'] = "Aerograph";

var LANG = LANG_EN;

/**
 * helper_get_classname
 * @param obj
 * @return Object class name
 */
function helper_get_classname (obj){
	 if (typeof obj === "undefined")
		    return "undefined";
		  if (obj === null)
		    return "null";
		  return Object.prototype.toString.call(obj)
		    .match(/^\[object\s(.*)\]$/)[1];
}

/**
 * Drawing circle on a given canvas
 * @param canvas
 * @param x
 * @param y
 * @param size
 * @param color
 * @return bool
 */
function helper_draw_circle (canvas, x, y, size, color) {
	//console.log('Draw circle: ' + x + ' / ' + y);
	if (canvas === undefined || x === undefined || y == undefined) {
		console.error('Invalid parameters');
		return 0;
	}
	var ctx = canvas.getContext('2d');
	if (!ctx) {
		console.error('Cannot get context 2d from canvas');
		console.error(canvas);
		return 0;
	}
	if (!color) { color = 'rgb(0,0,0)'; }
	if (!size) { size = 1;}
	//console.log(ctx);
	//ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(x, y, size, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	return 1;
}

/**
 * Our global object
 * @returns
 */
function glob() {
	this.components = new Array();
	this.shoClassName = helper_get_classname(this);
	this.id_generator = new util_genid(1);
	this.color_foreground = null;
};

/* Searching component by type and name */
glob.prototype.has_component = function(p_component) {
	for (var i = 0; i < this.components.length; i++) {
		var component = this.components[i];
		if (component.type == p_component.type && component.name == p_component.name) {
			return component;
		}
	}
	return null;
};

/* Adding component */
glob.prototype.add_component = function(component) {
//	if (this.has_component(component)) {
//		console.error(this.shoClassName + ' already present');
//		return false;
//	}
	this.components.push(component);
};

glob.prototype.test_all = function() {
	console.log('Testing all components');
	for (var i = 0; i < this.components.length; i++) {
		var component = this.components[i];
		var label = component.type + '_' + component.name;
		if (component.test()) {
			console.log('[OK] ' + label);
		} else {
			console.log('[FAIL] ' + label);			
		}
	}
};


var GLOB = new glob();