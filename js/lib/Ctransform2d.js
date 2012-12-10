/**
 * Class  Ctransform2d
 * 17:56:06 / 4 déc. 2012 [jsgraph] sho 
 */
function Ctransform2d(options) {
	options = options || {};
	options.className = "Ctransform2d";
	options.label = "Ctransform2d";
	Cobject.call(this, options, []);
	this.matrix = new Cmatrix33();
	this.matrix.identity();
	this.position = new Cvector2d();
	this.u = new Cvector2d();
	this.v = new Cvector2d();
	//this.bounding = new Cbounding_rectangle({parent: this});
}

/* Inheritance */
Ctransform2d.prototype = Object.create(Cobject.prototype);
Ctransform2d.prototype.constructor = new Cobject();


/**
 *
 */
Ctransform2d.prototype.translate = function(point) {
	if (!('x' in point) || ! 'y' in point) {
		this.exception('camel_camouflage_failed');
	}
	this.matrix.translate(point);
};

/**
*
*/
Ctransform2d.prototype.rotate = function(point) {
	if (!('x' in point) || ! 'y' in point) {
		this.exception('camel_camouflage_failed');
	}
	this.matrix.translate(point);
};

/**
*
*/
Ctransform2d.prototype.translate = function(angle) {
	if (!angle) {
		this.exception('camel_camouflage_failed');
	}
	this.matrix.translate(point);
};
