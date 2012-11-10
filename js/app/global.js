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
	//console.log(this.num_created, 'Created UID', str);
	return str;
};

Cuid.prototype.init = function() {
	this.id = this.get();
	console.log('id: ' + this.id);
};

var UID = new Cuid();

function Cobject() {
	this._class_init();
	this.init();
}

Cobject.prototype._class_init =function() {
	this.uid = UID.get();
};

Cobject.prototype.init = function() {
	;
};

Cobject.prototype.dom_get = function() {
	return this.dom_build().rootElm;
};

function Cdraw_glob() {
	this.graphing_interval = 5;
	this.css_draggable_class = "draggable  ui-widget ui-widget-content ui-corner-all ui-draggable ui-resizable"
};

var DRAWGLOB = new Cdraw_glob();

function helper_build_header($parent, p_class, label) {
	if (!$parent || !p_class || !label) {
		console.error('Require 3 parameters');
	}
	var $r = $(document.createElement('div'));
	$r.append('<div class="ui-widget-header">'+label+'</div>');
	$parent.append($r);
}