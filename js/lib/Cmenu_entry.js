/**
 * Class  Cmenu_entry
 * 06:48:26 / 24 nov. 2012 [jsgraph] sho 
 */
function Cmenu_entry(options) {
	options = options || {};
	options.className = "Cmenu_entry";
	Cobject.call(this, options, ['label', 'callback_click']);
}

/* Inheritance */
Cmenu_entry.prototype = Object.create(Cobject.prototype);
Cmenu_entry.prototype.constructor = new Cobject();

/**
 *
 */
Cmenu_entry.prototype.dom_build = function() {
	var that = this;
	var r = $('<li />');
	console.log('Menu entry', this);
	r.append('<a href="#"><p>' + this.label + '</p></a>');
	r.click(function() {
		that.callback.click.call(that, that);
		that.send_trigger('menu_click', that);
	});
	this.rootElm = r;
	return this;
};