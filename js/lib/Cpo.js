/**
 * Class  Cpo
 * 07:23:28 / 25 nov. 2012 [jsgraph] sho 
 */
function Cpo(options) {
	PO = {
			en: {
				menu_new_surface: 'New',
				menu_theme: 'Theme',
				menu_about: 'About',
				menu_toolbox: 'Toolbox',
				menu_file: 'File',
				menu_help: 'Help',
				menu_edition: 'Edition',
				foreground_color: 'Foreground color',
				background_color: 'Background color',
			},
			fr: {
				menu_new_surface: 'Nouveau',
				menu_theme: 'Theme',
				menu_about: 'A propos',
				menu_file: 'Fichier',
				menu_help: 'Aide',
				menu_edition: 'Edition',
				foreground_color: 'Couleur principal',
				background_color: 'Couleur de fond'
		}
	};
	options = options || {};
	options.className = "Cpo";
	options.label = "po";
	options.def = 'en';
	Cobject.call(this, options, ['lang', 'def']);
}

/* Inheritance */
Cpo.prototype = Object.create(Cobject.prototype);
Cpo.prototype.constructor = new Cobject();


/**
 *
 */
Cpo.prototype.get = function(label) {
	var str = '';
	if (this.lang in PO && label in PO[this.lang]) {
		str = PO[this.lang][label];
	} else if (this.def in PO && label in PO[this.def]) {
		str = PO[this.def][label];
	} else {
		throw new Cexception_message({
			className: this.className,
			label: 'no_trad_and_no_def',
			object: '',
			additional: label
		});
	}
	return str;
};
