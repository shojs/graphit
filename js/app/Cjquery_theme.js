function Cjquery_theme_injector(name) {
    this.key = 'shojs-jquery-theme';
    this.name = name || 'south-street';
    this.ls = new Clocal_storage();
    this.init(this.name);
    this.inject_script(this.name);
}

Cjquery_theme_injector.prototype.init = function(name) {
    var ntheme = this.ls.get(this.key);
    if (ntheme) {
	this.theme = ntheme;
    } else {
	this.ls.set(this.key, name);
    }
};

Cjquery_theme_injector.prototype.inject_script = function(name) {
    var e = document.createElement('link');
    e.setAttribute('rel', 'stylesheet');
    var src = 'http://code.jquery.com/ui/1.9.1/themes/' + name
	    + '/jquery-ui.css';
    e.setAttribute('href', src);
    console.log("[Injecting/css]", src);
    document.getElementsByTagName('head')[0].appendChild(e);
};

var JQTHEMES = [ 'base', 'black-tie', 'blitzer', 'cupertino' ];
function Cjquery_theme() {
    this.className = 'Cjquery-theme';
    this.label = 'theme';
    this.key = 'shojs-jquery-theme';
    var parent = {
	className : this.className,
	label : this.label
    };
    this.pTheme = new Cparameter_select({
	type : Eparameter_type.select,
	label : 'them',
	choices : {
	    base : 'base',
	    black_tie : 'black-tie',
	    blitzer : 'blitzer',
	    cupertino : 'cupertino',
	},
	def : 'base'
    });
    for (p in this.parameters) {
	this.parameters[p]._init();
    }
}

Cjquery_theme.prototype.dom_build = function() {
    var d = $('<div title="Theme chooser"/>');
    d.append(this.pTheme.dom_get());
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