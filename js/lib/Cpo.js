(function(window, graphit, console, undefined) {
	
	'use strict';
	
	var Cobject = graphit.import('Cobject');
	var Cexception_message = graphit.import('Cexception_message');
	/**
	 * Class Cpo 07:23:28 / 25 nov. 2012 [jsgraph] sho
	 */
	var Cpo = function(options) {
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
				'load_image' : "Load image (URL)"
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
				'load_image' : "Charger image (URL)"
			}
		};
		this['PO'] = this.PO;
		this['label'] = null;
		this['def'] = 'en';
		options = options || {};
		options['className'] = 'po';
		options['label'] = "po";
		options['def'] = 'en';
		options['lang'] = options['lang'] || options['def'];
		Cobject.call(this, options, [
				'lang', 'def'
		]);
	};

	/* Inheritance */
	Cpo.prototype = Object.create(Cobject.prototype);
	Cpo.prototype.constructor = new Cobject();

	/**
	 *
	 */
	Cpo.prototype.get = function(label) {
		var that = this;
		var def = this['def'];
		var lang = this['lang'] || def;
		var po = null;
		if (lang in this['PO'] && label in this['PO'][lang]) {
			po = this['PO'][lang];
		} else if (def in this['PO'] && label in this['PO'][def]) {
			po = this['PO'][def];
		} else {
			throw new Cexception_message({
				'className' : this.className,
				'label' : 'no_trad_and_no_def',
				'object' : that,
				'additional' : label
			});
		}
		return po[label];
	};
	Cpo.prototype['get'] = Cpo.prototype.get;

	/**
	 * Method to_s Graphit[js/lib/Cpo.js] sho / 12 déc. 2012 / 11:31:13
	 * 
	 * @param opt
	 *            {Hash} Options hash
	 */
	Cpo.prototype.to_s = function(opt) {
		opt = opt || {};
		var nl = opt.nl || "\n";
		var str = '[' + this.className + ']' + nl;
		str += ' - label: ' + this.label + nl;
		for (var lang in this['PO']) {
			str += '--- LANG ' + lang + nl;
			for (var msg in this['PO'][lang]) {
				str += ' - ' + msg + ' => ' + this['PO'][lang][msg] + nl;
			}
		}
		return str;
	};
	Cpo.prototype['to_s'] = Cpo.prototype.to_s;

	/**
	 * Method set_lang Graphit[js/lib/Cpo.js] sho / 12 déc. 2012 / 12:07:00
	 * 
	 * @param lang
	 *            {String} Language selected (2 chars ex: 'fr', 'en'...)
	 */
	Cpo.prototype.set_lang = function(lang) {
		this['lang'] = lang;
	};

	Cpo.prototype['set_lang'] = Cpo.prototype.set_lang;
	/**
	 * Method __test Graphit[js/lib/Cpo.js] sho / 12 déc. 2012 / 08:34:55
	 */
	Cpo.prototype.__test = function(dumbopt) {
		var Cpo = graphit.import('Cpo');
		var T = new Cpo({
			'lang' : 'en'
		});
		for ( var lang in T.PO) {
			console.log('Lang <<<', lang, '>>>');
			for ( var label in T.PO[lang]) {
				console.log('Label to translate: ' + label);
				console.log(' - Translate', T.get(label));
			}
		}
		var lang = 'fr';
		console.log('Setting lang to', lang);
		this.set_lang(lang);
		console.log(T.to_s());
		return true;
	};
	Cpo.prototype['__test'] = Cpo.prototype.__test;

	/* EXPORT */
	graphit.export('Cpo', Cpo);
})(window, graphit, console);
