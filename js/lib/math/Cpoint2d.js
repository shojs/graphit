/**
 * A point in space
 * @param x
 * @param y
 * @returns
 */
function Cpoint2d(pos) {
	if (pos != undefined && (!('x' in pos) || !('y' in pos))) {
		throw new Cexception_message({
			className: 'Cpoint',
			error: 'invalid_component', 
			additional: pos});
	}
	pos = pos || {x: 0, y: 0};
    Object.defineProperty(this, "x", {
    	value: pos.x,
    	writable: true,
    	enumerable: true,
    	configurable: false
    });
    Object.defineProperty(this, "y", {
    	value: pos.y,
    	writable: true,
    	enumerable: true,
    	configurable: false
    });
}

/**
 * 
 */
Cpoint2d.prototype.round = function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
};
