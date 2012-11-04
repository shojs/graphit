function util_genid(start) {
	start = parseInt(start);
	if (!start) { start = 0; }
	this.counter = start;
}

util_genid.prototype.get = function() {
	return this.counter++;
};