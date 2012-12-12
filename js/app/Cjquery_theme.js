(function($NS) {
	'use strict';
	'use strict';
	window.graphit = $NS['graphit'];
	//var getBird = window.graphit['getBird'];
	//window.graphit = window['graphit'];
//	window.graphit.getBird = window['graphit'];
//	var getBird = window.graphit['getBird'];
	var Cparameter_select = $NS.getBird('Cparameter_select');
	var Clocal_storage = $NS.getBird('Clocal_storage');

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
		new($NS.getBird('Cjquery_theme_injector'))();
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
		var src = $NS['baseStaticContent']
				+ 'js/plugin/jquery-ui/1.9.2/themes/' + name + '/jquery-ui.css';
		e.setAttribute('href', src);
		console.log("[Injecting/css]", src);
		document.getElementsByTagName('head')[0].appendChild(e);
	};
	Cjquery_theme_injector.prototype['inject_script'] = Cjquery_theme_injector.prototype.inject_script;
	
	$NS['_class_pool']['Cjquery_theme_injector'] = Cjquery_theme_injector;
	
	/**
	 * @constructor
	 * @returns
	 */
	var Cjquery_theme = function() {
		var that = this;
		this['className'] = 'Cjquery-theme';
		this['label'] = 'chooser';
		this['key'] = 'shojs-jquery-theme';
		var parent = {
			'className' : this['className'],
			'label' : this['label']
		};
		this.pTheme = new Cparameter_select({
			'parent' : this,
			'label' : 'name',
			'choices' : {

				'base' : 'base',
				'black_tie' : 'black-tie',
				'blitzer' : 'blitzer',
				'cupertino' : 'cupertino',
				'dark_hive' : 'dark-hive',
				'dot_luv' : 'dot-luv',
				'eggplant' : 'eggplant',
				'excite_bike' : 'excite-bike',
				'flick' : 'flick',
				'hot_sneaks' : 'hot-sneaks',
				'humanity' : 'humanity',
				'le_frog' : 'le-frog',
				'mint_choc' : 'mint-choc',
				'overcast' : 'overcast',
				'pepper_grinder' : 'pepper-grinder',
				'redmond' : 'redmond',
				'smoothness' : 'smoothness',
				'south_street' : 'south-street',
				'start' : 'start',
				'sunny' : 'sunny',
				'swanky_purse' : 'swanky-purse',
				'trontastic' : 'trontastic',
				'ui_darkness' : 'ui-darkness',
				'ui_lightness' : 'ui-lightness',
				'vader' : 'vader',
			},
			'def' : 'base',
			'callback_change' : function(value) {
				var src = window.graphit.baseStaticContent
						+ 'js/plugin/jquery-ui/1.9.2/themes/' + value
						+ '/jquery-ui.css';
				console.log('src', src);
				$("#ui-theme").attr("href", src);
				// window.location.reload();
			}
		});
		this['pTheme'] = this.pTheme;
		// #TODO Why i called init on the first place
		// this.pTheme._init();
		this.rootElm = null;
		return this;
	};

	Cjquery_theme.prototype.dom_build = function() {
		var d = $('<div title="Theme chooser"/>');
		d.append(this.pTheme.dom_get());
		this.rootElm = d;
		return this;
	};
	Cjquery_theme.prototype['dom_build'] = Cjquery_theme.prototype.dom_build;
	
	Cjquery_theme.prototype.dom_get = function(force) {
		if (this.rootElm && force != undefined && !force) {
			return this.rootElm;
		}
		return this.dom_build().rootElm;
	};
	Cjquery_theme.prototype['dom_get'] = Cjquery_theme.prototype.dom_get;
	
	/*
	 * Export to our Main module and make Google Closure happy
	 * Graphit[js/app/Cjquery_theme.js] sho / 12 déc. 2012 / 15:17:34
	 */
	$NS['_class_pool']['Cjquery_theme'] = Cjquery_theme;
	//$NS['theme'] = new Cjquery_theme();
})(graphit);
