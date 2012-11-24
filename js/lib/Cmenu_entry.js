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

