(function(window, graphit, console, undefined) {
	
	'use strict';
	
	/*
	 * Imports
	 */
	var Clocal_storage = graphit.import('Clocal_storage');
	//var Cparameter_select = graphit.import('Cparameter_select');
	/**
	 * @constructor
	 * @param name
	 * @returns
	 */
	var Cjquery_theme_injector = function(name) {
		// function Cjquery_theme_injector(name) {
		this['key'] = 'cjquery-theme-chooser-name';
		this['name'] = name || 'south-street';
		this['ls'] = new Clocal_storage();
		this.init(this.name);
		this.inject_script(this.name);
	};

	/**
	 * Method __test
	 * graphit[js/app/Cjquery_theme.js]
	 * sho / 12 déc. 2012 / 19:06:11
	 * @param dumbopt {String} dumbstring
	 */
	Cjquery_theme_injector.prototype.__test = function(dumbopt) {
		new(graphit.import('Cjquery_theme_injector'))();
	};
	Cjquery_theme_injector.prototype['__test'] = Cjquery_theme_injector.prototype.__test;
	
	/**
	 * 
	 * @param name
	 */
	Cjquery_theme_injector.prototype.init = function(name) {
		var ntheme = this['ls'].get(this['key']);
		if (ntheme) {
			this['name'] = ntheme;
		} else {
			this['ls'].set(this['key'], name);
			this.name = name;
		}
	};
	Cjquery_theme_injector.prototype['init'] = Cjquery_theme_injector.prototype.init;
	
	/**
	 * 
	 * @param name
	 */
	Cjquery_theme_injector.prototype.inject_script = function(name) {
		var e = document.createElement('link');
		e.setAttribute('rel', 'stylesheet');
		e.setAttribute('id', 'ui-theme');
		var src = graphit.baseStaticContent 
				+ 'js/plugin/jquery-ui/1.9.2/themes/' + name + '/jquery-ui.css';
		e.setAttribute('href', src);
		console.log("[Injecting/css]", src);
		document.getElementsByTagName('head')[0].appendChild(e);
	};
	Cjquery_theme_injector.prototype['inject_script'] = Cjquery_theme_injector.prototype.inject_script;
	
	graphit.export('Cjquery_theme_injector', Cjquery_theme_injector);

})(window, graphit, console);