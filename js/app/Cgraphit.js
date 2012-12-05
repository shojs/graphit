/**
 * Class Cgraphit The main shojs-graphit class This class hold our toolbox and
 * manage our Csurface This class also install keybinding and act as a proxy
 * threw our Csurface Its the single entry point into the whole project, each
 * created object must be accessible threw it. #TODO: Using console to create
 * new object easily 06:00:32 / 23 nov. 2012 [jsgraph] sho
 */
function Cgraphit(options) {
	options = options || {};
	options.className = "Cgraphit";
	options.label = "graphit";
	options.widgets = {};
	this.surfaces = [];
	this.selected = null;
	Cobject.call(this, options, [
		'widgets'
	]);
	this.dialog_options = {
			position: 'right top'
	};
	/* Building our dom so surface create can append new element */
	this.dom_get();
	/* We are creating a default surface */
	this.surface_create({
		parent : this,
		width : 400,
		height : 400
	});
}

/* Inheritance */
Cgraphit.prototype = Object.create(Cobject.prototype);
Cgraphit.prototype.constructor = new Cobject();

/**
 * Intialize our Cgraphit object
 */
Cgraphit.prototype.init = function(options) {
	var that = this;
	this.bind_trigger(this, 'create_surface', function(e, options) {
		//console.log('Creating surface', options);
		that.surface_create(options);
	});
	/* Update trigger binding */

	/* Menu trigger binding */
	this.bind_trigger(this, 'display_new_surface', function(e, options) {
		that.dialog_new_surface().dialog('open').dialog('moveToTop');
	});
	this.bind_trigger(this, 'display_widget', function(e, cElm) {
		that.get_widget(cElm).dialog('open').dialog('moveToTop');
	});
	this.wJquerytheme = new Cjquery_theme();
	this.wAbout = new Clicense();
	/* 
	 * Menu 
	 */
	this.cMenu = new Cmenu({
		parent : null,
		type : 'jquery',
		label : "graphit_menu",
		entries : {
			/* FILES */
			files : {
				label : T('menu_file'),
				entries : {
					new_surface : {
						label : T('menu_new_surface'),
						callback_click : function() {
							that.send_trigger('display_new_surface');
						}
					},
				}
			},
			/* Edition */
			edition : {
				label : T('menu_edition'),
				entries : {
					toolbox : {
						label : T('menu_toolbox'),
						callback_click : function() {
							that.send_trigger('display_widget',
									that.cToolbox);
						}
					},
				}
			},
			/* Help */
			help : {
				label : T('menu_help'),
				entries : {
					theme : {
						label : T('menu_theme'),
						callback_click : function() {
							that.send_trigger('display_widget', that.wJquerytheme);
						}
					},
					about : {
						label : T('menu_about'),
						callback_click : function() {
							that.send_trigger('display_widget', that.wAbout);
						}
					},
				}
			},

		},
	});
	/* Toolbox */
	this.cToolbox = new Ctoolbox(CTOOL_tools, {
		parent : this
	});
	this.bind_trigger(this.cToolbox, 'update', function(e, d) {
		// #TODO console.log('Toolbar updated');
	});
	/* Grapher */
	this.cGrapher = new Cgrapher({
		parent : this
	});
	this.bind_trigger(this.cGrapher, 'update', function(e, d) {
	});

	this.keybindings = {
		'n' : {
			label : 'pen',
			callback : function() {
				that.cToolbox.select_tool_by_name('pen');
				return false;
			},
		},
		'p' : {
			label : 'brush',
			callback : function() {
				that.cToolbox.select_tool_by_name('brush');
				return false;
			},
		},
		'Shift+e' : {
			label : 'eraser',
			callback : function() {
				that.cToolbox.select_tool_by_name('eraser');
				return false;
			},
		},
		'Ctrl+z' : {
			label : 'undo',
			callback : function(e) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				if (!that.selected) {
					console.warn('No surface selected to call undo');
					return false;
				}
				that.selected.undo();
				return false;
			},
		},
	};
	// $(document).unbind('keydown');;
	for ( var seq in this.keybindings) {
		$(document).bind('keydown', seq, this.keybindings[seq].callback);
	}
	// Display toolbox by default
	this.send_trigger('display_widget', this.cToolbox);
};

/**
 * Return DOM corresponding to a given widget We are storing each widget into
 * this.widgets
 * 
 * @param {cWidget}
 *            An object having dom_get method
 */
Cgraphit.prototype.get_widget = function(cWidget) {
	if (!('dom_get' in cWidget)) this.exception('method_object_missing',
			'dom_get');
	if (cWidget.label in this.widgets) {
		return this.widgets[cWidget.label];
	}
	var opt = {
		closeOnEscape : true,
		modal : true,
	};
	if ('dialog_options' in cWidget) {
		for (label in cWidget['dialog_options']) {
			opt[label] = cWidget['dialog_options'][label];
		}
		;
	}
	var r = cWidget.dom_get().dialog(opt);
	this.widgets[cWidget.label] = r;
	return r;
};

/**
 * Pop up a new Csurface widget (helper)
 */
Cgraphit.prototype.dialog_new_surface = function() {
	if ('new_surface' in this.widgets) {
		return this.widgets.new_surface;
	}
	var that = this;
	var r = $('<div />').attr('title', 'New Csurface');
	var g = $('<div />').addClass('group group-new-surface');
	// #FIXME: BAD NAME FOR AUTOSAVE... too generic
	var width = new Cparameter_numeric({
		label : 'width',
		bAutosave : false,
		parent : this,
		min : 1,
		max : 1920,
		step : 1,
		def : 400
	});
	var height = new Cparameter_numeric({
		label : 'height',
		parent : this,
		bAutosave : false,
		min : 1,
		max : 1280,
		step : 1,
		def : 400
	});
	g.append(width.dom_get(), height.dom_get());
	r.append(g);
	r.dialog({
		modal : false,
		closeOnEscape : true,
		stack : true,
		zIndex : 10,
		buttons : {
			Ok : function() {
				var e = $(this).parent();
				that.send_trigger('create_surface', {
					width : e.find('.width input').attr('value'),
					height : e.find('.height input').attr('value')
				});
				// e.hide();
			},
			Cancel : function() {
				$(this).dialog('close');
			}
		}
	});
	this.widgets.new_surface = r;
	return r;
};

/**
 * Create a new surface, appending it int this.surfaces and add it to our
 * rootElm
 */
Cgraphit.prototype.surface_create = function(options) {
	var that = this;
	options.parent = this;
	var s = null;
	try {
		s = new Csurface_workspace(options);
	} catch (e) {
		this.intercept(e);
		console.error('Cannot create surface, Exception <<< ', e, ' >>>');
		return false;
	}
	this.bind_trigger(s.cSurface, 'surface_selected', function(e, cSurface) {
		if (!(cSurface instanceof Csurface)) {
			that.exception('invalid_surface_selected_parameter');
		}
		cSurface.attach_graphit(that);
		that.selected = cSurface;
	});
	widget_factory(s.dom_get(), {
		width : (parseInt(options.width) + 100)
	});
	this.surfaces.push(s);
	if (!this.selected) {
		this.selected = s;
	}
	this.dom_build_add_surface(s);
	return true;
};

/**
 * Helper that build a single Csurface element that we can append to rootElm
 */
Cgraphit.prototype.dom_build_add_surface = function(cSurface_workspace) {
	var that = this;
	var s = $('<div class="group group-graphit-surface" />');
	var c = new Ccanvas({
		width : 50,
		height : 50
	});
	var cSurface = cSurface_workspace.cSurface;
	cSurface.canvas_preview = c;
	c.copy({
		src : cSurface.cCanvas
	});
	s.append(c.dom_get());
	this.rootElm.find('.group-graphit-surfaces').append(s);
	cSurface.bind_trigger(cSurface, 'redraw_preview', function(e, eSurface) {
		cSurface.canvas_preview.copy({
			src : eSurface.cCanvas,
			resize : true
		});
	});
	s.click(function() {
				cSurface.send_trigger('surface_selected', cSurface);
				cEach(that.surfaces, function(i, cWorkspace) {
					//console.log(e, cSurface);
					if (cWorkspace.cSurface == cSurface) {
						cWorkspace.rootElm.parent().dialog(
								'open').dialog('moveToTop');

					} else {
						// e.rootElm.parent().find('.surface').parent().dialog('close');
					}
				});
				$(this).parent().find('.group-graphit-surface').removeClass(
						'selected');

				$(this).addClass('selected');
			});
	return this;
};

/**
 * Builing our DOM rootElm
 */
Cgraphit.prototype.dom_build = function() {
	// widget_factory(this.cToolbox.dom_get(), {
	// position : "right top"
	// });
	var r = $('<div />');
	var g = $('<div class="group group-menu" />');
	// widget_factory(this.cMenu.dom_get(), {});
	g.append(this.cMenu.dom_get());
	//$('body').prepend(g);
	r.append(g);
	g = $('<div class="group group-graphit-surfaces"/>');
	cEach(this.surfaces, function(i, elm) {
		var s = $('<div class="graphit-surface" />');
		var c = new Ccanvas({
			width : 50,
			height : 50
		});
		c.copy(elm.cCanvas, true);
		s.append(c.dom_get());
		g.append(s);
	});
	r.append(g);
	var badge = $('<div class="group group-badge">');
	badge.append(''
			+ '<a href="#http://jigsaw.w3.org/css-validator/check/referer">'
			+ '<img style="border:0;width:44px;height:16px"'
			+ '    src="/images/w3-vcss.gif"'
			+ '    alt="Valid CSS!" \/></a>');
	badge
			.append('<a href="#http://www.w3.org/html/logo">'
					+ '<img src="/images/HTML5_Logo_32.png" width="32" height="32" alt="HTML5 Powered with Graphics, 3D &amp; Effects, Multimedia, and Performance &amp; Integration" title="HTML5 Powered with Graphics, 3D &amp; Effects, Multimedia, and Performance &amp; Integration">'
					+ '</a>');
	r.append(badge);
	this.rootElm = r;
	return this;
};

/**
 * Return Csurface list
 */
Cgraphit.prototype.list = function(callback) {
	for ( var i = 0; i < this.surfaces.length; i++) {
		callback.call(this, i, this.surfaces[i]);
	}
	return this.surfaces.length;
};
