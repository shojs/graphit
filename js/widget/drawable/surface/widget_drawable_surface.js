

/**
 * 
 * CLASS Holding drawable area toolbar
 * @param < id >
 * @return Newly created object
 */
function widget_drawable_surface(id) {
	if (!id) {
		console.error('widget_drawable_toolbar constructor need id parameter');
		return null;
	}
	console.log('Build surface');
	this.id = id + '-surface';
	this.rootElm = null;
	this.canvas = null;
	this.ctx = null;
	var that = this;
	this.mouse = new util_trackmouse(
		function(e) {
			var x = e.pageX - that.canvas.offsetLeft;
			var y = e.pageY - that.canvas.offsetTop;
			//console.log('mouse: ' + x + ', ' + y);
			this.x = x;
			this.y = y;
		}, 
		function(e) {

		},
		function(e) {
		},
		function(s) {
			if (this.points.length < 2) {
				return;
			}//console.log('mouse: ' + this.x + ' / ' + this.y);
			var sp = this.points.shift();
			var ep = this.points.shift();
			var mp = that.interpolate(sp, ep);
			var c = $.jPicker.List[0].color.active.val('rgba');
			var color = 'rgb('+c.r+','+c.g+','+c.b+')';
			var s = $(that.rootElm).parent().children('.drawable-toolbar').children('.options');
			s = s.children('.component-slider').children('input').attr('value');
			//console.log(s);	
			helper_draw_circle (that.canvas, sp.x, sp.y, s, color);
			helper_draw_circle (that.canvas, mp.x, mp.y, s, color);
			helper_draw_circle (that.canvas, ep.x, ep.y, s, color);

			//that.ctx.save();
			//that.ctx.scale(0.25,0.25);
//				var dataURL = that.canvas.toDataURL();
//				var $preview = document.getElementById('drawing-preview');
//				//console.log($preview);
//				$preview.width = 200;
//				$preview.height = 150;
//				$preview.src = dataURL;
			that.ctx.restore();

		}
	);
	this._build();
	return this;
}

function math_middle(x, y) {
	var total;
	if (x < 0 && y < 0) {
		if (x < y) { total = Math.abs(x) + y;}
		else { total = Math.abs(y) + x; }
	} else if (x > 0 && y > 0) {
		if (x < y) { total = y - x; }
		else { total = x - y; }
	} else {
		if (x < 0) { total = Math.abs(x) + y; }
		else { total = Math.abs(y) + x; }
	}
	total = Math.floor(total / 2);
	//console.log('Middle: ' + x + ' / ' + total + ' / ' + y);
	return total;
};

widget_drawable_surface.prototype.interpolate = function(sp, ep) {
	var p = new util_trackmouse_point(0,0);
	p.x = sp.x +  math_middle(sp.x, ep.x);
	p.y = sp.y + math_middle(sp.y, ep.y);
	return p;
};

widget_drawable_surface.prototype.clear = function(color) {
	if (!color) { 
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		return;
	}
	console.log('Clearing surface: ' + color);
	this.ctx.fillStyle = color;
	this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
};
/**
 * 
 */
widget_drawable_surface.prototype.unselect_all = function() {
	for (var i = 0; i < this.tools.length ; i++) {
		this.tools[i].unselect();
	}
};

/**
 * 
 * @returns {widget_drawable_surface}
 */
widget_drawable_surface.prototype._build = function() {
	var that = this;
	var root = document.createElement('div');
	root.setAttribute('id', this.id);
	$(root).addClass('widget-drawable-surface');
	$(root).append('<h4>surface</h4>');
	var img = document.createElement('canvas');
	
	img.setAttribute('id', this.id + '-canvas');
	img.setAttribute('width', 800);
	img.setAttribute('height', 600);
	this.canvas = img;
	this.ctx = this.canvas.getContext('2d');
	this.clear('rgb(0,0,0)');
	
	$(img).mousemove(function(e) {
		that.mouse.set(e);
	});
	$(img).mousedown(function(e) {
		that.mouse.push();
	});
	$(img).mouseup(function(e) {
		that.mouse.release();
	});
	$(img).mouseout(function(e) {
		that.mouse.release();
	});
	$(root).append(img);
	this.rootElm = root;
	return this;
};

widget_drawable_surface.prototype.inject = function(tElm) {
	$(tElm).append(this.rootElm);
};

/**
 * 
 * @returns
 */
widget_drawable_surface.prototype.get_element = function() {
	return this.rootElm;
};