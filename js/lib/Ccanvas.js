function Ccanvas(width, height, background_color) {
	if (background_color instanceof Ccolor) {
		this.background_color = background_color;
	} else {
		this.background_color = new Ccolor(0,0,0,0);
	}
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width', width);
	this.canvas.setAttribute('height', height);
	this.ctx = this.canvas.getContext('2d');
	this.clear(this.background_color);
};

Ccanvas.prototype.getContext = function(type) {
	return this.canvas.getContext(type);
};

Ccanvas.prototype.clear = function(color) {
	if (this.background_color.a == 0) {
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
	} else {
		this.ctx.save();
		this.ctx.fillStyle = this.background_color.to_rgba();
		this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
		this.ctx.restore();
	}
};

Ccanvas.prototype.save = function() {
	var data = this.canvas.toDataURL('image/png');
	if (!window.open(data)) {
		document.location.href = data;
	}
};

Ccanvas.prototype.clear = function(color) {
	if (!(color instanceof Ccolor)) {
		console.error('Fist parameter is not a Ccolor instance');
		return false;
	}
	if (color.a == 0) {
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
	} else {
		this.ctx.fillStyle = color.to_rgba();
		this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
	}
	return true;
	
};