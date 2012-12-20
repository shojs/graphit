(function(window, graphit, console, undefined) {

	'use strict';
	
	var DEBUG = (graphit.debug > 10)? true: false;
	
	var modulePath = 'lib/po';
	
	var Cobject = graphit.import('lib/object');
	var Cexception_message = graphit.import('lib/exception');
	/**
	 * Class Module 07:23:28 / 25 nov. 2012 [jsgraph] sho
	 */
	var Module = function(options) {
		this.PO = {
			'en' : {
				'menu_new_surface' : 'New',
				'menu_theme' : 'Theme',
				'menu_about' : 'About',
				'menu_toolbox' : 'Toolbox',
				'menu_file' : 'File',
				'menu_help' : 'Help',
				'menu_edition' : 'Edition',
				'menu_login' : 'Login',
				'menu_logout' : 'Logout',
				'foreground_color' : 'Foreground color',
				'background_color' : 'Background color',
				'layers' : 'Layers',
				'switch_color' : 'Switch color',
				'tool_pencil' : 'Pen',
				'tool_paintbrush' : 'Brush',
				'tool_eraser' : 'Eraser',
				'tool_bucket-fill' : 'Fill',
				'tool_color-picker' : 'Color picker',
				'right_click_to_save' : 'Right click -> Save as',
				'save_image' : 'Save image',
				'save' : "Save",
				'open' : "Open",
				'load' : "Load",
				'load_image' : "Load image (URL)",
				'TEST_test': "TEST_test: Testing PO translation",
				'widget_toolbox': 'Toolbox'
			},
			'fr' : {
				'menu_new_surface' : 'Nouveau',
				'menu_theme' : 'Theme',
				'menu_about' : 'A propos',
				'menu_file' : 'Fichier',
				'menu_help' : 'Aide',
				'menu_edition' : 'Edition',
				'menu_toolbox' : 'Outils',
				'foreground_color' : 'Couleur principal',
				'background_color' : 'Couleur de fond',
				'layers' : 'Calques',
				'switch_color' : 'Echange de couleur',
				'tool_pencil' : 'Crayon',
				'tool_paintbrush' : 'Pinceau',
				'tool_eraser' : 'Gomme',
				'tool_bucket-fill' : 'Remplir',
				'tool_color-picker' : 'Selection de couleur',
				'right_click_to_save' : 'Clique droit -> Enregistrer l\'image sous',
				'save' : 'Sauver',
				'open' : 'Ouvrir',
				'load' : "Charger",
				'load_image' : "Charger image (URL)",
				'TEST_test': "TEST_test: TEST des traductions PO "
			}
		};
		this['PO'] = this.PO;
		this['label'] = null;
		this['def'] = 'en';
		options = options || {};
		options['className'] = modulePath;
		options['label'] = "po";
		options['def'] = 'en';
		options['lang'] = options['lang'] || options['def'];
		Cobject.call(this, options, [
				'lang', 'def'
		]);
	};

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 *
	 */
	Module.prototype.get = function(label) {
		if (!label) this.exception('undefined_parameter', 'label');
		var that = this;
		var def = this['def'];
		var lang = this['lang'] || def;
		var po = null;
		if (lang in this['PO'] && label in this['PO'][lang]) {
			po = this['PO'][lang];
		} else if (def in this['PO'] && label in this['PO'][def]) {
			po = this['PO'][def];
		} else {
			//@FIX: doesn't throw error on undefined label
			throw new Cexception_message({
				'className' : this.className,
				'label' : 'no_trad_and_no_def',
				'object' : that,
				'additional' : label
			});
		}
		if (!po[label]) this.exception('translation_fail', {label:label, lang: lang});
		return po[label];
	};
	Module.prototype['get'] = Module.prototype.get;

	/**
	 * Method to_s Graphit[js/lib/Module.js] sho / 12 déc. 2012 / 11:31:13
	 * 
	 * @param opt
	 *            {Hash} Options hash
	 */
	Module.prototype.to_s = function(opt) {
		opt = opt || {};
		var nl = opt.nl || "\n";
		var str = '[' + this.className + ']' + nl;
		str += ' - label: ' + this.label + nl;
		for ( var lang in this['PO']) {
			str += '--- LANG ' + lang + nl;
			for ( var msg in this['PO'][lang]) {
				str += ' - ' + msg + ' => ' + this['PO'][lang][msg] + nl;
			}
		}
		return str;
	};
	Module.prototype['to_s'] = Module.prototype.to_s;

	/**
	 * Method set_lang Graphit[js/lib/Module.js] sho / 12 déc. 2012 / 12:07:00
	 * 
	 * @param lang
	 *            {String} Language selected (2 chars ex: 'fr', 'en'...)
	 */
	Module.prototype.set_lang = function(lang) {
		this['lang'] = lang;
	};
	Module.prototype['set_lang'] = Module.prototype.set_lang;

	/**
	 * Method __test Graphit[js/lib/Module.js] sho / 12 déc. 2012 / 08:34:55
	 */
	Module.prototype.__test = function() {
		var lang = 'fr';
		var M = graphit.import('lib/po');
		var m = new M({
			'lang' : 'en'
		});
		for ( var poLang in m.PO) {
			if (DEBUG) console.log('Lang <<<', poLang, '>>>');
			for ( var poLabel in m.PO[poLang]) {
				var trans = m.get(poLabel);
				if (DEBUG) {
					console.log('Label to translate: ' + poLabel);
					console.log(' - Translate', trans);
				}
			}
		}
		if (DEBUG) console.log('Setting lang to', lang);
		m.set_lang(lang);
		if (DEBUG) console.log(m.to_s());
		return true;
	};
	Module.prototype['__test'] = Module.prototype.__test;

	/* EXPORT */
	graphit.export(modulePath, Module);
	
})(window, graphit, console);
