(function(window, graphit, console, undefined) {

	'use strict';

	var modulePath = 'app/core/theme';
	
	/**
	 * @constructor
	 */
	function Module () {
		var Cparameter_select = graphit.import('lib/parameter/select');
		this['className'] = modulePath;
		this['label'] = 'chooser';
		this['key'] = 'shojs-jquery-theme';
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
			}
		});
		this['pTheme'] = this.pTheme;
		this.rootElm = null;
		return this;
	};

	/**
	 * 
	 * @returns {Module}
	 */
	Module.prototype.dom_build = function() {
		var d = $('<div title="Theme chooser"/>');
		d.append(this.pTheme.dom_get());
		this.rootElm = d;
		return this;
	};

	/**
	 * 
	 * @param force
	 * @returns
	 */
	Module.prototype.dom_get = function(force) {
		if (this.rootElm && force != undefined && !force) {
			return this.rootElm;
		}
		return this.dom_build().rootElm;
	};
	
	/**
	 * Method __test
	 * graphit[js/app/Module.js]
	 * sho / 13 déc. 2012 / 03:18:40
	 */
	Module.prototype.__test = function() {
		var C = graphit.import(modulePath);
		var t = new C();
		t.dom_get().dialog();
	};

	/*
	 * Export to our Main module and make Google Closure happy
	 */
	graphit.export(modulePath, Module);

})(window, graphit, console);
