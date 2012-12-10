function Cjquery_theme_injector(name) {
	this.key = 'cjquery-theme-chooser-name';
	this.name = name || 'south-street';
	this.ls = new Clocal_storage();
	this.init(this.name);
	this.inject_script(this.name);
}

Cjquery_theme_injector.prototype.init = function(name) {
	var ntheme = this.ls.get(this.key);
	if (ntheme) {
		this.name = ntheme;
	} else {
		this.ls.set(this.key, name);
		this.name = name;
	}
};

Cjquery_theme_injector.prototype.inject_script = function(name) {
	var e = document.createElement('link');
	e.setAttribute('rel', 'stylesheet');
	e.setAttribute('id', 'ui-theme');
	var src = window.graphit.baseStaticContent + 'js/plugin/jquery-ui/1.9.2/themes/' + name
			+ '/jquery-ui.css';
	e.setAttribute('href', src);
	console.log("[Injecting/css]", src);
	document.getElementsByTagName('head')[0].appendChild(e);
};

var JQTHEMES = [
		'base', 'black-tie', 'blitzer', 'cupertino'
];
function Cjquery_theme() {
	var that = this;
	this.className = 'Cjquery-theme';
	this.label = 'chooser';
	this.key = 'shojs-jquery-theme';
	var parent = {
		className : this.className,
		label : this.label
	};
	this.pTheme = new Cparameter_select({
		type : Eparameter_type.select,
		parent : this,
		label : 'name',
		choices : {

			base : 'base',
			black_tie : 'black-tie',
			blitzer : 'blitzer',
			cupertino : 'cupertino',
			dark_hive : 'dark-hive',
			dot_luv : 'dot-luv',
			eggplant : 'eggplant',
			excite_bike : 'excite-bike',
			flick : 'flick',
			hot_sneaks : 'hot-sneaks',
			humanity : 'humanity',
			le_frog : 'le-frog',
			mint_choc : 'mint-choc',
			overcast : 'overcast',
			pepper_grinder : 'pepper-grinder',
			redmond : 'redmond',
			smoothness : 'smoothness',
			south_street : 'south-street',
			start : 'start',
			sunny : 'sunny',
			swanky_purse : 'swanky-purse',
			trontastic : 'trontastic',
			ui_darkness : 'ui-darkness',
			ui_lightness : 'ui-lightness',
			vader : 'vader',
		},
		def : 'base',
		callback_change : function(value) {
			var src = '/js/plugin/jquery-ui/1.9.2/themes/' + value
					+ '/jquery-ui.css';
			console.log('src', src);
			$("#ui-theme").attr("href", src);
			//window.location.reload();
		}
	});
	// #TODO Why i called init on the first place
	//this.pTheme._init();
	this.rootElm = null;
	return this;
}

Cjquery_theme.prototype.dom_build = function() {
	var d = $('<div title="Theme chooser"/>');
	d.append(this.pTheme.dom_get());
	this.rootElm = d;
	return this;
};

Cjquery_theme.prototype.dom_get = function(force) {
	if (this.rootElm && force != undefined && !force) {
		return this.rootElm;
	}
	return this.dom_build().rootElm;
};

function Cscript_injector(d) {
	this.parse(d);
}

Cscript_injector.prototype.parse = function(d) {
	for ( var i = 0; i < d.length; i++) {
		this.inject(d[i]);
	}
};

Cscript_injector.prototype.inject = function(h) {
	var type = 'script';
	if (h.t == 'css') {
		type = 'link';
	}
	var e = document.createElement(type);
	var src = h.p + '/' + h.n + '.' + h.t;
	var msg = "[Injecting/" + h.t + "]";
	if (h.t == 'js') {
		if (!('defer' in h) || h.defer) {
			msg += "[defered]";
			//e.setAttribute('defer', true);
		}
		e.setAttribute('type', 'text/javascript');
		e.setAttribute('src', src);
	} else if (h.t == 'css') {
		e.setAttribute('rel', 'stylesheet');
		e.setAttribute('href', src);
	} else {
		console.error('Invalid injected type <<', h.t, '>>');
		return false;
	}
	msg += " ";

	document.getElementsByTagName('head')[0].appendChild(e);
	console.log(msg, src);
	return true;
};
