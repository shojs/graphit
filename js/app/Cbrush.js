/**
 * Class  Cbrush
 * [jsgraph] 22 nov. 2012
 */

var Ebrush_type = new Cenum({
		js: 1,
		gbr: 2
});

function Cbrush(options) {
	options.className = "Cbrush";
	options.label = "brush";
	Cobject.call(this, options, ['parent', 'name', 'type']);
}

/* Inheritance */
Cbrush.prototype = Object.create(Cobject.prototype);
Cbrush.prototype.constructor = new Cobject();

/**
 *
 */
Cbrush.prototype.init = function(options) {
	if (!this.type || !this.name) {
		console.error("Cbrush need <<type>> and <<name>> parameter");
		return false;
	}
	if (this.type == Ebrush_type.js) {
		this._load_js(options);
	} else if (this.type == Ebrush_type.gbr) {
		console.log('Parsing Gimp Brush');
		this._load_gbr(options);
	} else {
		console.error('Unknow Cbrush type', this.type);
		return false;
	}
	return this.init_canvas(options);
};

/**
 *
 */
Cbrush.prototype.init_canvas = function(options) {
	var canvas = new Ccanvas({width: options.data.width, height: options.data.height});
	canvas.clear(new Ccolor());
	this.cCanvas = canvas;
	//this.callback.update.call(this, this.parent);
};

/**
 *
 */
Cbrush.prototype.update = function() {
	this.callback.update.call(this, this.parent);
};

/**
 *
 */
Cbrush.prototype._load_js = function(options) {
	if (!('callback_update' in options.data)) {
		console.error('Javascript brush must contain a callback_update function');
		return false;
	}
	this.callback.update = options.data.callback_update;
	if (!('width' in options.data) || !('height' in options.data)) {
		console.error('Javascript brush need width and height property');
		return false;
	}
	return true;
};

/**
 *
 */
Cbrush.prototype._load_gbr = function(dumbopt) {
	// dumb comment
};


	
/**
 *
 */
Cbrush.prototype.dom_build = function() {
	var that = this;
	var r = $('<div />');
	var g = $('<div />');
	g.addClass('group-brush group');
	g.append('<label>'+Ebrush_type.key_by_value(this.type)+' / '+this.name+'</label>');
	g.append(this.cCanvas.dom_get());
	r.append(g);
	r.click(function() {
			that.send_trigger('brush_selected', that);
			var g = $(this).parents('.group-brushmanager').find('.group-brush').removeClass('selected');
			$(this).children('.group-brush').addClass('selected');
	});
	this.rootElm = r;
	return this;
};