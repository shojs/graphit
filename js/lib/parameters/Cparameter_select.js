/**
 * A select parameter
 * @param options
 */
function Cparameter_select(options) {
    options.type = Eparameter_type.select;
    options.className = 'Cparameter_select';
    options.autoSave = ('autoSave' in options && !options.autoSave)? false: true;
    Cparameter.call(this, options);
    
}

Cparameter_select.prototype = Object.create(Cparameter.prototype);
Cparameter_select.prototype.constructor = new Cparameter();

/**
 * 
 * @param options
 */
Cparameter_select.prototype.init = function(options) {
    this.choices = {};
    this.def = options.def;
    this.label = options.label;
    for (label in options.choices) {
	this.choices[label] = options.choices[label];
    }

};

/*
 * Calle by parent class when setting parameter value
 *
 */
//Cparameter_select.prototype._set = function(value) {
//    return value;
//};

/**
 * Build our html element
 * @returns {Cparameter_select}
 */
Cparameter_select.prototype.dom_build = function() {
    var that = this;
    var r = $(document.createElement('div'));
    r.addClass('selectex parameter');
    r.append('<h6>' + this.label + '</h6>');
    var s = $('<select />');
    for (c in this.choices) {
	var o = $('<option/>');
	o.attr('value', this.choices[c]);
	if (this.value == this.choices[c]) {
	    o.attr('selected', 'selected');
	}
	o.append(document.createTextNode(this.choices[c]));
	s.append(o);
    }
    s.change(function() {
	that.set(this.value);
	that.rootElm.find('option').each(function() {
	    var e = $(this);
	   // e.attr('selected', false);
	});
	//$(this).attr('selected', true);
	if ('callback_change' in that) {
	    that.callback_change.call(that, this.value);
	}
    });
    r.append(s);
    this.rootElm = r;
    return this;
};