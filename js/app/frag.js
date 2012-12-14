(function(window, graphit, console, undefined) {

	var modulePath = 'app/frag';
	
	var Cobject = graphit.import('lib/object');
	var Ccolor = graphit.import('lib/color');
	var Ccanvas = graphit.import('lib/canvas');
	var Cvector2d = graphit.import('lib/math/vector2d');
	
	/***************************************************************************
	 * @constructor Fragment are images who composed layer global image
	 * @param parent
	 * @param width
	 * @param height
	 */
	function Module(options) {
		options.className = modulePath;
		options.label = 'frag';
		Cobject.call(this, options, [
				'parent', 'position', 'width', 'height', 'color'
		]);
		if (!this.color) this.color = new Ccolor();
		this.cCanvas = new Ccanvas({
			width : this.width,
			height : this.height,
			bg_color : this.color
		});
		if (!this.position || !(this.position instanceof Cvector2d)) {
			this.exception('invalid_position');
		}
	}
	;

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * @param source
	 * @param sx
	 * @param sy
	 * @param swidth
	 * @param sheight
	 * @param tx
	 * @param ty
	 * @returns {Boolean}
	 */
	Module.prototype.drawImage = function(source, sx, sy, swidth, sheight, tx,
			ty) {
		var dcanvas = this.cCanvas.data;
		var ctx = this.cCanvas.data.getContext('2d');
		try {
			ctx.drawImage(source, sx, sy, swidth, sheight, 0, 0, dcanvas.width,
					dcanvas.height);
		} catch (e) {
			console.error('Cannot draw to fragment', e);
			return false;
		}
		return true;
	};

	graphit.export(modulePath, Module);
	
})(window, graphit, console);
