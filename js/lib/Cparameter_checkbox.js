/**
 * 
 * @param options
 */
function Cparameter_checkbox(options) {
    options.type = Eparameter_type.checkbox;
    Cparameter.call(this, options);
}

Cparameter_checkbox.prototype = Object.create(Cparameter.prototype);
Cparameter_checkbox.prototype.constructor = new Cparameter();

Cparameter_checkbox.prototype.init = function(options) {
    this.choices = {};

};

/**
 * 
 * @param value
 * @returns {Boolean}
 */
Cparameter_checkbox.prototype._get = function(value) {
    if (value == 'true')
	return true;
    else if (value == 'false')
	return false;
    else if (value)
	return true;
    else
	return false;
};

/**
 * 
 * @param v
 */
Cparameter_checkbox.prototype._set = function(v) {
    if (v == 'false' || !v) {
	v = false;
    } else {
	v = true;
    }
    if (v) {
	this.value = true;
	if (this.rootElm) {
	    this.rootElm.find('input').attr('checked', 'checked');
	}
    } else {
	this.value = false;
	if (this.rootElm) {
	    this.rootElm.find('input').removeAttr('checked');
	}
    }
};

/**
 * 
 * @returns {Cparameter}
 */
Cparameter.prototype.dom_build = function() {
    var that = this;
    var r = $('<div />');
    r.addClass('selectex parameter');
    r.append('<h6>' + this.label + '</h6>');
    var s = $('<input />');
    s.attr('type', 'checkbox');
    s.attr('title', label);
    if (this.value) {
	s[0].checked = 'checked';
    }
    s.change(function() {
	console.log(this);
	that.set(this.checked);
	if ('callback_change' in that) {
	    that.callback_change.call(that, s[0].checked);
	}
    });
    r.append(s);
    this.rootElm = r;
    return that;
};