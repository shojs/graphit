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
	options.label = "Cgraphit";
	this.surfaces = [];
	this.selected = null;
	Cobject.call(this, options, []);
	/* Building our dom so surface create can append new element */
	this.dom_get();
	/* We are creating a default surface */
	this.surface_create({parent: this, width: 640, height: 480});
}

/* Inheritance */
Cgraphit.prototype = Object.create(Cobject.prototype);
Cgraphit.prototype.constructor = new Cobject();

/**
 * Intialize our Cgraphit object
 */
Cgraphit.prototype.init = function(dumbopt) {
	var that = this;
	this.bind_trigger(this, 'create_surface', function(e, options) {
		console.log('Creating surface', options);
		that.surface_create(options);
	});

	/* Menu */
	this.cMenu = new Cmenu({
		parent : this,
		entries : {
			about : {
				label : 'about',
				callback_click : function() {
					that.send_trigger('display_about');
				}
			},
			new_surface : {
				label : 'new',
				callback_click : function() {
					that.send_trigger('display_new surface');
				}
			}
		},
	});
	/* Toolbox */
	this.cToolbox = new Ctoolbox(CTOOL_tools, {
		parent : this
	});
	this.bind_trigger(this.cToolbox, 'update', function(e, d) {
		console.log('Toolbar updated');
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
			},
		},
		'p' : {
			label : 'brush',
			callback : function() {
				that.cToolbox.select_tool_by_name('brush');
			},
		},
		'Shift+e' : {
			label : 'eraser',
			callback : function() {
				that.cToolbox.select_tool_by_name('eraser');
			},
		},
		'Ctrl+z' : {
			label : 'undo',
			callback : function() {
				if (!that.selected) {
					console.warn('No surface selected to call undo');
					return false;
				}
				that.selected.undo();
			},
		},
	};
	for (seq in this.keybindings) {
		$(document).bind('keydown', seq, this.keybindings[seq].callback);
	}
};

/**
 * Pop up a new Csurface widget (helper)
 */
Cgraphit.prototype.widget_new_surface = function(dumbopt) {
	var that = this;
	var r = $('<div />').attr('title', 'New Csurface');
	var g = $('<div />').addClass('group group-new-surface');
	// @FIXME: BAD NAME FOR AUTOSAVE... too generic
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
				$(this).remove();
			}
		}
	});
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
		s = new Csurface(options);
	} catch (e) {
		this.intercept(e);
		console.error('Cannot create surface, Exception <<< ', e, ' >>>');
		return false;
	}
	this.bind_trigger(s, 'surface_selected', function(e, cSurface) {
		if (!(cSurface instanceof Csurface)) {
			that.exception('invalid_surface_selected_parameter');
		}
		cSurface.attach_graphit(that);
		that.selected = cSurface;
		cSurface.rootElm.parent().dialog('open');

	});
	this.surfaces.push(s);
	if (!this.selected) {
		this.selected = s;
	}

	s.send_trigger('show');
	this.dom_build_add_surface(s);
	return true;
};

/**
 * Helper that build a single Csurface element that we can append to rootElm
 */
Cgraphit.prototype.dom_build_add_surface = function(cSurface) {
	var that = this;
	var s = $('<div class="group group-graphit-surface" />');
	var c = new Ccanvas({
		width : 50,
		height : 50
	});
	cSurface.canvas_preview = c;
	c.copy({
		src : cSurface.cCanvas
	});
	s.append(c.dom_get());
	this.rootElm.append(s);
	cSurface.bind_trigger(cSurface, 'redraw_preview', function(e, eSurface) {
		cSurface.canvas_preview.copy({
			src : eSurface.cCanvas,
			resize : true
		});
	});
	s
			.click(function() {
				// that.selected.rootElm.parent().hide();
				cSurface.send_trigger('surface_selected', cSurface);
				cEach(that.surfaces, function(i, e) {
					if (e == cSurface) {
						e.rootElm.parent().find('.surface').parent().dialog(
								'open').dialog('moveToTop');

					} else {
						// e.rootElm.parent().find('.surface').parent().dialog('close');
					}
				})
				$(this).parent().find('.group-graphit-surface').removeClass(
						'selected');

				$(this).addClass('selected');
			});
	return this;
};

/**
 * Builing our DOM rootElm
 */
Cgraphit.prototype.dom_build = function(dumbopt) {
	var widget = widget_factory(this.cToolbox.dom_get(), {})
	var r = $('<div/>');
	var g = $('<div class="group group-surfaces"/>');
	cEach(this.surfaces, function(i, elm) {
		var s = $('<div class="graphit-surface" />');
		var c = new Ccanvas({width: 50, height: 50});
		c.copy(elm.cCanvas, true);
		s.append(c.get_dom());
		g.append(s);
	});
	r.append(g);
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