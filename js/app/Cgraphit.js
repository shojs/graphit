/**
 * Class  Cgraphit
 * 06:00:32 / 23 nov. 2012 [jsgraph] sho 
 */
function Cgraphit(options) {
	options = options || {};
	options.className = "Cgraphit";
	options.label = "Cgraphit";
	this.surfaces = [];
	this.selected = null;
	Cobject.call(this, options, []);
	/* Toolbox */
	this.cToolbox = new Ctoolbox(CTOOL_tools, {
		parent : this
	});
	this.bind_trigger(this.cToolbox, 'update', function(e,d) {
		console.log('Toolbar updated');
	});
	/* Grapher */
	this.cGrapher = new Cgrapher({parent: this});
	this.bind_trigger(this.cGrapher, 'update', function(e, d) {
	});
}

/* Inheritance */
Cgraphit.prototype = Object.create(Cobject.prototype);
Cgraphit.prototype.constructor = new Cobject();

/**
 *
 */
Cgraphit.prototype.init = function(dumbopt) {
	var that = this;
	this.bind_trigger(this, 'create_surface', function(e, d) {
		console.log('Creating surface', d);
		that.surface_create(d);
	})
};

/**
 *
 */
Cgraphit.prototype.widget_new_surface = function(dumbopt) {
	var that = this;
	var r = $('<div />').attr('title', 'New Csurface');
	var g = $('<div />').addClass('group group-new-surface');
	// @FIXME: BAD NAME FOR AUTOSAVE... too generic
	var width = new Cparameter_numeric({
		label: 'width',
		bAutosave : false,
		parent: this,
		min: 1,
		max: 1920,
		step: 1,
		def: 400
	});
	var height = new Cparameter_numeric({
		label: 'height',
		parent: this,
		bAutosave : false,
		min: 1,
		max: 1280,
		step: 1,
		def: 400
	});
	g.append(width.dom_get(), height.dom_get());
	r.append(g);
	r.dialog({
		modal: false,
		closeOnEscape: true,
		stack: true,
		zIndex: 10,
		buttons: {
			Ok: function() {
				var e = $(this).parent();
				that.send_trigger('create_surface', {
					width: 	e.find('.width input').attr('value'),
					height: e.find('.height input').attr('value')
				});
				//e.hide();
			},
			Cancel: function() {
				$(this).remove();
			}
		}
	});
};

/**
 *
 */
Cgraphit.prototype.surface_create = function(options) {
	var that = this;
	options.parent = this;
	var s = null;
	try {
		s = new Csurface(options);
	} catch (e) {
		console.log('Exception', e);
		return false;
	}
	this.bind_trigger(s, 'surface_selected', function(e, cSurface) {
		if (!(cSurface instanceof Csurface)) {
			that.exception('invalid_surface_selected_parameter');
		}
		console.log('Surface selected');
		cSurface.attach_graphit(that);
		that.selected = cSurface;
	});
	this.surfaces.push(s);
	if (!this.selected) {
		this.selected = s;
	}
	s.send_trigger('show');
	return true;
};

/**
 *
 */
Cgraphit.prototype.dom_build = function(dumbopt) {
	var r = $('<div/>');
	var g = $('<div class="group group-toolbox"/>');
	widget_factory(this.cToolbox.dom_get(), { })
	g.append('plop');
	r.append(g);
	this.rootElm = r;
	return this;
};

/**
 *
 */
Cgraphit.prototype.list = function(callback) {
	for(var i = 0; i < this.surfaces.length; i++) {
		callback.call(this, i, this.surfaces[i]);
	}
	return this.surfaces.length;
};
