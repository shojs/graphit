(function(window, graphit, console, undefined) {
	
	'use strict';
	
	var modulePath = 'app/jquery/themeInjector';
	
	var DEBUG = (graphit.debug > 5)? true: false;
	
	/*
	 * Imports
	 */
	var Clocal_storage = graphit.import('lib/localStorage');
	
	/**
	 * @constructor
	 * @param name
	 * @returns
	 */
	var Module = function(name) {
		this['className'] = modulePath;
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
	 */
	Module.prototype.__test = function() {
		new(graphit.import(modulePath))();
	};
	Module.prototype['__test'] = Module.prototype.__test;
	
	/**
	 * 
	 * @param name
	 */
	Module.prototype.init = function(name) {
		var ntheme = this['ls'].get(this['key']);
		if (ntheme) {
			this['name'] = ntheme;
		} else {
			this['ls'].set(this['key'], name);
			this.name = name;
		}
	};
	Module.prototype['init'] = Module.prototype.init;
	
	/**
	 * 
	 * @param name
	 */
	Module.prototype.inject_script = function(name) {
		var id = 'ui-theme';
		var e = document.getElementById(id);
		var src = graphit.baseStaticContent 
		+ 'js/plugin/jquery-ui/1.9.2/themes/' + name + '/jquery-ui.css';
		if (!e) {
			var e = document.createElement('link');
			e.setAttribute('rel', 'stylesheet');
			e.setAttribute('id', 'ui-theme');
			e.setAttribute('href', src);
			console.log("[Injecting/css]", src);
			document.getElementsByTagName('head')[0].appendChild(e);
		} else {
			e.setAttribute('href', src);
		}
	};
	Module.prototype['inject_script'] = Module.prototype.inject_script;
	
	graphit.export(modulePath, Module);

})(window, graphit, console);