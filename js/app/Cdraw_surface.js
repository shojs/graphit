/**
 * 
 */
var E_LAYERLABEL = new Object({
	current : 1,
	mouse : 2,
	grid : 3,
});

/**
 * 
 * @param width
 * @param height
 * @returns
 */
function Cdraw_surface(width, height) {
	this.width = width;
	this.height = height;
	this.layer_mouse = new Cdraw_layer(this, E_LAYERLABEL.mouse);
	this.layer_grid = new Cdraw_layer(this, E_LAYERLABEL.grid);
	this.layers = new Array();
	this.set_current_layer(this.layer_grid);
}

Cdraw_surface.prototype.set_current_layer = function(layer) {
	this.layer_current = layer;
};

Cdraw_surface.prototype.get_layer = function(label) {
	if (!label || label == E_LAYERLABEL.current)
		return this.layer_current;
	if (isInt(label)) {
		return this.layers[label];
	}
	if (label == E_LAYERLABEL.mouse)
		return this.layer_mouse;
	if (label == E_LAYERLABEL.grid)
		return this.layer_grid;
};

Cdraw_surface.prototype.add_layer = function() {
	var layer = new Cdraw_layer(this, 'layer');
	this.layers.push(layer);
	return layer;
};