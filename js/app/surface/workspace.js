(function(window, graphit, console, undefined) {

	var modulePath = 'app/surface/workspace';
	
	var Cobject = graphit.import('lib/object');

	/**
	 * Class Module 12:12:16 / 25 nov. 2012 [jsgraph] sho
	 */
	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.label = "Workspace";

		Cobject.call(this, options, []);
	}

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * Class init
	 */
	Module.prototype.init = function(opt) {
		var that = this;
		try {
			this.cSurface = new Csurface(opt);
		} catch (e) {
			console.error('Cannot create surface');
			throw e;
		}
		this.bind_trigger(this, 'show', function() {
			that.show();
		});
	};

	/**
	 * DOM element
	 */
	Module.prototype.dom_build = function() {
		if (!this.cSurface) this.exception('surface_is_null');
		var that = this;
		var r = $('<div class="graphit-workspace"/>');
		var navbar = $('<div class="navbar"/>');
		navbar.append(new Cicon({
			name : 'stock-layers',
			size : 24,
			width : 32,
			height : 32,
			label : T('layers'),
			callback_click : function() {
				that.cSurface.layer_manager.dom_get().dialog({
					autoOpen : true
				});
				return false;
			}
		}).dom_get());
		navbar.append(new Cicon({
			name : 'stock-image',
			size : 24,
			width : 32,
			height : 32,
			label : T('save'),
			callback_click : function() {
				that.__save_dialog();
				return false;
			}
		}).dom_get());
		/**
		 * This feature require a proxy and some sort of authentication...
		 */
		if ('auth' in window.graphit && !window.graphit.auth.is_disable()) {
			navbar.append(new Cicon({
				path : 'preferences',
				name : 'folders',
				width : 32,
				height : 32,
				label : T('open'),
				callback_click : function() {
					that.__load_dialog();
					return false;
				}
			}).dom_get());
		}
		r.append(navbar);
		r.append(this.cSurface.dom_get());
		var footer = $('<div />');
		// footer.append(this.cSurface.parameters.zoom.dom_get());
		r.append(footer);
		this.rootElm = r;
		return this;
	};

	/**
	 * @private Method / save_dialog Open a new window with our canvas copied as
	 *          image Saving like this is a bit ugly but ...
	 */
	Module.prototype.__save_dialog = function() {
		var r = $('<div />');
		r.attr('title', 'save');
		var canvas = this.cSurface.cCanvas.clone();
		var w = window
				.open(
						null,
						'graphit-save',
						'resizable=yes, scrollbars=yes, titlebar=yes, width=300, height=300 top=10, left=10',
						false);
		var head = $(w.document.head);
		if (head.find('title').length == 0) {
			head.append('<title>GraphIt - ' + T('save_image') + '</title>');
		}
		var css = $('<link id="id-graphit-css" type="text/css" rel="stylesheet" href="css/style.css"/>');
		if (head.find('#id-graphit-css').length == 0) {
			head.append(css);
		}
		var body = $(w.document.body);
		body.empty();
		var g = $('<div class="graphit-window group" />');
		g.append('<h3>' + T('right_click_to_save') + '<h3/>');
		var img = new $('<img />');
		img.attr('src', canvas.data.toDataURL());

		img.attr('width', 200);
		img.attr('title', "graphit-image");
		img.attr('alt', "graphit-image");
		img.css('background-image', 'url("img/grid-40x40.png")');
		g.append(img);
		body.append(g);
	};

	/**
	 * @private Open a dialog so user can select a image to load. Loaded image
	 *          will be placed into new layer on success
	 */
	Module.prototype.__load_dialog = function() {
		var that = this;
		try {
			return this.get_widget('load').dialog('open');
		} catch (e) {
			console.warn('Can\'t get <<load>> widget');
		}
		var rootElm = $('<div />');
		var input = $('<input type="url" width="200" value="http://1.bp.blogspot.com/_cmrGYcwOHPE/TLXcloz0rFI/AAAAAAAAAas/Tv98tJD7qO0/s1600/plop1.gif"/>');
		var submit = $('<button>' + T('load') + '</button>');
		submit.click(function() {
			$(this).parent().dialog('close');
			var _input = $(this).parent().find('input');
			var getBase = function() {
				loc = window.location;
				var pn = loc.pathname.split('/');
				pn = pn.slice(0, pn.length - 1).join('/');
				var url = loc.protocol + '//' + loc.hostname + '/' + pn;
				return url;
			};
			var server_url = getBase() + 'php/DataURL/';
			console.log('server', server_url);
			try {
				if (!graphit.auth.get('verifiedEmail')) {
					// that.exception('user_must_be_logged', null, {dialog:
					// true});
				}
				$.getImageData({
					url : _input.attr('value'),
					server : server_url,
					callback : '?',
					success : function(image) {
						var width = that.cSurface.cCanvas.data.width;
						var height = that.cSurface.cCanvas.data.height;
						var layer = new Clayer({
							width : width,
							height : height,
							// #TODO text-overflow don't work when
							// setting label as long url (no space)
							// label: '' + _input.attr('value'),
							label : 'Web Image'
						});
						layer.copy({
							src : image
						});
						that.cSurface.layer_manager.add(layer);
					},
					error : function(xhr, text_status) {
						console
								.error('Cannot load image', _input
										.attr('value'));
						that.exception('cannot_load_image', text_status, {
							dialog : true
						});
					}
				});
			} catch (e) {
				widget_exception(e);

			}
		});
		rootElm.append(input);
		rootElm.append(submit);
		rootElm.attr('title', T('load_image'));
		this.add_widget('load', rootElm);
		rootElm.dialog();
	};

	/**
	 *
	 */
	Module.prototype.show = function() {
		this.dom_get();
	};

	graphit.export(modulePath, Module);

})(window, graphit, console);
