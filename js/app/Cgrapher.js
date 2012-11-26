/**
 * Holding data passed between grapher and tools
 * @param options
 * @returns
 */
function Cgraphit_message(options) {
	options = options || {};
	options.className = 'Cmessage';
	options.label = 'message';
	Cobject.call(this, options, [
			'cSurface', 'cMouse', 'cTool', 'cToolbox', 'points', 'fgColor',
			'bgColor', 'cGrapher', 'index'
	]);
}

Cgraphit_message.prototype = Object.create(Cobject.prototype);
Cgraphit_message.prototype.constructor = new Cobject();


var Egrapher_mode = {
		continuous: 1,
		endpoint: 2
	};

/**
 * Cgrapher is responsible to record points and send data to the tools
 * when mouse is pressed
 * @param {Hash} options Constructor hash
 */

function Cgrapher(options) {
	options = options || {};
	options.className = 'Cgrapher';
	options.label = 'grapher';
	Cobject.call(this, options, [
		'parent'
	]);

}

/* Inheritance */
Cgrapher.prototype = Object.create(Cobject.prototype);
Cgrapher.prototype.constructor = new Cobject();

/**
 * Init
 */
Cgrapher.prototype.init = function() {
	if (!this.parent) this.exception('no_parent_argument');
	this.reset_index();
	this.timer = null;
	this.mode = Egrapher_mode.continuous;
};

/**
 * Reset our index to zero
 */
Cgrapher.prototype.reset_index = function() {
	this.index = 0;
};

/**
 * Method actually called when grapher is started
 * @param {Object} d Data passed to our grapher
 * @returns {Boolean}
 */
Cgrapher.prototype._graph = function(cMessage) {
	var numpoint = cMessage.points.length;
	if (numpoint <= 2) {
		return false;
	}
	if (this.index >= (numpoint - 1)) {
		return false;
	}
	var p1 = cMessage.points[this.index];
	var p2 = cMessage.points[(this.index + 1)];
	cMessage.A = p1;
	cMessage.B = p2;
	cMessage.index = this.index;
	if (cMessage.cTool.graph(cMessage)) {
		if (!this.last_redraw
				|| ((Date.now() - this.last_redraw) > (1000 / 60))) {
			this.last_redraw = Date.now();
			cMessage.cSurface.redraw(true);
		}
	}
	this.index++;
};

/**
 * Stop grapher
 * @returns {Boolean}
 */
Cgrapher.prototype.stop = function() {

	if (!this.timer) {
		console.warn('Grapher is not started');
		return false;
	}
	// Clearing our timer
	clearInterval(this.timer);
	//clearInterval(this.timer_update);
	this.timer = null;
	//this.timer_update = null;

	// We are drawing our prefrag layer into our current layer
	var cs = this.parent.selected;
	var cMouse = cs.cMouse;
	var cLayer = cs.layer_manager.selected;
	var cPrefrag = cs.layer_manager.special_layers.prefrag;
	var dcanvas = cLayer.cCanvas.data;
	var cTool = this.parent.cToolbox.selected;
	var size = (this.parent.cToolbox.selected.parameters.size.value);
	var dsize = size / 2;
	var width = (cMouse.maxx - cMouse.minx) + size;
	var height = (cMouse.maxy - cMouse.miny) + size;
	var x = cMouse.minx - dsize;
	if (x < 0) {
		x = 0;
	}
	if ((x + width) > dcanvas.width) {
		width = dcanvas.width - x;
	}
	var y = cMouse.miny - dsize;
	if (y < 0) {
		y = 0;
	}
	if ((y + height) > dcanvas.height) {
		height = dcanvas.height - y;
	}
	if ('_postgraph' in cTool) {
		cTool._postgraph(x, y, width, height, 0, 0, width, height);
	} else {
		cLayer.drawImage(cPrefrag.cCanvas.data, x, y, width, height, 0, 0);
	}
	cLayer.redraw();
	cs.redraw();
	// We are clearing our prefrag layer so it's ready for next draw
	cs.layer_manager.special_layers.prefrag = new Clayer({
		parent : cs.layer_manager,
		label : '_prefrag',
		width : cs.get_width(),
		height : cs.get_height()
	});

	// Reseting index that represent where we are into recorded points
	this.index = 0;
	return true;
};

/**
 * Start grapher
 */
Cgrapher.prototype.start = function() {
	if (this.timer) {
		console.error('Grapher already started');
		return false;
	}
	var that = this;
	if (!this.parent.cToolbox || !this.parent.cToolbox.selected) {
		this.send_trigger('error', 'no-tool-selectionned');
		console.error('No tool selectionned!');
		return false;
	}
	var parent = this.parent;
	var cMessage = new Cgraphit_message({
		cSurface : parent.selected,
		cMouse : parent.selected.cMouse,
		cTool : parent.cToolbox.selected,
		cToolbox : parent.cToolbox,
		points : parent.selected.cMouse.points,
		fgColor : parent.cToolbox.fg_color,
		bgColor : parent.cToolbox.bg_color,
		cGrapher : this,
		index : this.index,
	});
	that.timer = window.setInterval(function() {
		that._graph(cMessage);
	}, 20);
	return true;
};
