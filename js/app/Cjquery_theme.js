function Cjquery_theme_injector(name) {
    this.key = 'shojs-jquery-theme';
    this.name = name || 'south-street';
    this.ls = new Clocal_storage();
    this.init(this.name);
    console.log('Loading jquery theme', this.name);
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
    e.setAttribute('href', 'http://code.jquery.com/ui/1.9.1/themes/'+name+'/jquery-ui.css');
    // var s = '<link rel="stylesheet"
    // href="http://code.jquery.com/ui/1.9.1/themes/'+name+'/jquery-ui.css" />';
    console.log(document.getElementsByName('head'));
    document.getElementsByTagName('head')[0].appendChild(e);
    // h[0].innertHTML = h[0].innerHTML + s;
};




function Cscript_injector(d) {
    this.parse(d);
}

Cscript_injector.prototype.parse = function(d) {
    for(var i = 0; i < d.length; i++) {
	this.inject(d[i]);
    }    
};

Cscript_injector.prototype.inject = function(h) {
    var type = 'script';
    var e = document.createElement(type);
    var head = document.getElementsByTagName('head')[0];
    if (h.t == 'js') {
	e.setAttribute('type', 'text/javascript');
	var src = h.p + '/' + h.n + '.' + h.t;
	e.setAttribute('src', src);
	head.appendChild(e);
	console.log('JS Script injected', src);
    } else {
	console.error('Invalid injected type <<', h.t, '>>');
	return false;
    }
    return true;
};