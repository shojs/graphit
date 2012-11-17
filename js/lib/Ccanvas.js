function Ccanvas(width, height, background_color) {
	if (background_color instanceof Ccolor) {
		this.background_color = background_color;
	} else {
		this.background_color = new Ccolor(0,0,0,0);
	}
	this.data = document.createElement('canvas');
	this.data.setAttribute('width', width);
	this.data.setAttribute('height', height);
	this.ctx = this.data.getContext('2d');
	this.clear(this.background_color);
};

Ccanvas.prototype.getContext = function(type) {
	if (!type) { type = '2d'; }
	return this.data.getContext(type);
};

Ccanvas.prototype.getCanvas = function() {
	return this.data;
}

Ccanvas.prototype.clear = function(color) {
    	if (color instanceof Ccolor) {
    	    this.background_color = color;
    	}
	if (this.background_color.a == 0) {
		this.ctx.clearRect(0,0,this.data.width, this.data.height);
	} else {
		this.ctx.save();
		this.ctx.fillStyle = this.background_color.to_rgba();
		this.ctx.fillRect(0,0,this.data.width, this.data.height);
		this.ctx.restore();
	}
};


Ccanvas.prototype.save = function() {
	var data = this.data.toDataURL('image/png');
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
		this.ctx.clearRect(0,0,this.data.width, this.data.height);
	} else {
		this.ctx.fillStyle = color.to_rgba();
		this.ctx.fillRect(0,0,this.data.width, this.data.height);
	}
	return true;
	
};