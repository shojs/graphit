/******************************************************************************
 * 
 * @param options
 * @returns
 */
function Cparameter(options) {
	this.autosave = true;
	if (!options.parent) { 
		console.error('Ctool_parameter require parent in options {...}');
		return null;
	}
	this.parent = options.parent;
	this.checks = new Object({ label: 1, min: 1, max: 1, def: 1, step: 1,});
	for (k in this.checks) {
		if (!(k in options) || options[k] === undefined) {
			console.error('Missing parameter key/value', options, k);
			return null;
		}
		if (k == 'label') { this[k] = options[k]; }
		else { this[k] = parseFloat(options[k]); }
	}
	if ('callback_onchange' in options && typeof(options.callback_onchange) == 'function') {
		this.callback_onchange = options.callback_onchange;
	};
	this.reset();
	return this;
}

Cparameter.prototype.reset = function() {
	this.set(this.def);
};

Cparameter.prototype.get = function(k) {
	if (!(k in this)) {
		console.error('Invalid key', k);
		return null;
	}
	return this[k];
};

function getObjectClass(obj){
	   if (typeof obj != "object" || obj === null) return false;
	   console.log(obj.constructor.toString());
	   var pat = /^function (\w+)\(/;
	   return pat.exec(obj.constructor.toString())[1];
};

Cparameter.prototype.set = function(v) {
	v = parseFloat(v);
	if (v == this.value) {
		return this;
	}
	if (this.autosave && 'label' in this.parent) {
		var classname = 'global';
		if ('className' in this.parent) { classname = this.parent.className; }
		var label = classname + '-' + this.parent.label + '-' + this.label;
		cRegistry.set(label, v);
	}
	if ('callback_onchange' in this && typeof(this.callback_onchange) == 'function') {
		this.callback_onchange.call(this, v);
	}
	this.value = v;
	return this;
};