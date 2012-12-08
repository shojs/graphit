/**
 * Constructor / Ctool_color_picker
 */
function Ctool_color_picker(options) {
	options = options || {};
	options.className = 'Ctool_color_picker';
	options.label = 'color-picker';
	options.compositeOperation = Ecomposite_operation.xor;
	options.parameters = {
		size : {
			label : 'size',
			min : 1,
			max : 100,
			def : 20,
			step : 1
		},
	};
	Ctool.call(this, options, []);
}

/* Inheritance */
Ctool_color_picker.prototype = Object.create(Ctool.prototype);
Ctool_color_picker.prototype.constructor = new Ctool();

Ctool_color_picker.prototype.graph = function(cMessage) {
	var selected = cMessage.cSurface.layer_manager.get();
	if (!selected) {
		this.exception('no_layer_selected');
	}
	var data = selected.getImageData(0 , 0, selected.get_width(), selected.get_height());
	var color = new Ccolor().from_pixel(data, cMessage.A);
	console.log('Selected color', color.to_s());
	cMessage.cToolbox.fg_color.color.set(color);
	cMessage.cGrapher.stop();
	return true;
};