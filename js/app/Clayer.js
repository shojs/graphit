/*******************************************************************************
 * 
 */
var E_DRAWCOMPOSITION = new Object({
	'source-in' : 'source-in',
	'source-over' : 'source-over',

});

/*******************************************************************************
 * 
 * @param parent
 * @param label
 * @returns
 */
function Clayer(parent, label, p_composition) {
	this.uid = UID.get();
	var composition = p_composition;
	if (!composition) {
		composition = 'source-over';
	}
	this.composition = composition;
	this.parent = parent;
	this.label = label;
	this.visible = true;
	this.frags = new Array();
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width', parent.parent.width);
	this.canvas.setAttribute('height', parent.parent.height);
	this.ctx = this.canvas.getContext('2d');
	this.need_redraw = true;
	this.rootElm = null;
};

/**
 * 
 * @returns
 */
Clayer.prototype.discard_frag = function() {
	//console.log('length: ' + this.frags.length);
	this.need_redraw = true;
	return this.frags.pop();
};

/**
 * 
 */
Clayer.prototype.dom_get = function(index) {
	this.dom_build(index);
	return this.rootElm;
},

Clayer.prototype.set_visible = function(b) {
	if (b) { this.visible = true; }
	else { this.visible = false; }
};
/**
 * 
 * @returns {Clayer}
 */
Clayer.prototype.dom_build = function(index) {
	console.log('index', index);
	var that = this;
	var root = document.createElement('li');
	var $r = $(root);
	$r.attr('id', this.uid);
	$r.addClass('layer');
	if (index == 0) {
		$r.addClass('selected');
	}
	
	var button = new Cimage({ 
		src: 'img/16x16_eye.png', 
		width: 16, 
		height: 16, 
		callback_click: function(obj) {
			console.log("Clicked: ", obj);
		}
	});
	var table = document.createElement('table');
	var $t = $(table);;
	var $tr = $(document.createElement('tr'));
	var $td = $(document.createElement('td'));

	$td.append(button.dom_get());
	$tr.append($td);
	$td = $(document.createElement('td'));
	$td.append('Layer - '+this.label);	
	$td.addClass('label');
	$tr.append($td);
	$td =  $(document.createElement('td'));
	$td.addClass('preview');
	var canvas = document.createElement('canvas');
	this.canvas_preview = canvas;
	var $c = $(canvas);
	$c.attr('layer_index', index);
	var width = 100;
	var height = width * (this.canvas.height / this.canvas.width);
	$c.attr('width', width);
	$c.attr('height', height);
	$td.append($c);
	$tr.append($td);
	$td = $(document.createElement('td'));
	var b_up = new Cimage({ 
		src: 'img/16x16_up.png', 
		width: 16, 
		height: 16, 
		callback_click: function(obj) {
			that.parent.move_up(that.uid);
		}
	});
	$td.append(b_up.dom_get());
	var b_down = new Cimage({ 
		src: 'img/16x16_down.png', 
		width: 16, 
		height: 16, 
		callback_click: function(obj) {
			that.parent.move_down(that.uid);
		}
	});
	$td.append(b_down.dom_get());
	var b_trash = new Cimage({ 
		src: 'img/16x16_trash.png', 
		width: 16, 
		height: 16, 
		callback_click: function(obj) {
			var $s = $(this).parents('li.layer');
			if ($s) { 
				$r.remove(); 
				that.parent.remove(that);
			} else { console.error('Cannot remove layer element'); }
		}
	});
	$tr.append($td);
	$td = $(document.createElement('td'));
	$td.addClass('options');

	$td.append(b_trash.dom_get());
	
	$tr.append($td);
	$t.append($tr);
	$r.append($t);
	$r.click(function() {
		$(this).parents('.group-layers').children('li.layer').removeClass('selected');
		$(this).addClass('selected');
		that.parent.select(that);
	});
	this.rootElm = $r;
	return this;
};



/**
 * 
 */
Clayer.prototype.redraw_preview = function() {
	var ctx = this.canvas_preview.getContext('2d');
	ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
	ctx.drawImage(this.canvas, 0,0, this.canvas.width, this.canvas.height, 0, 0, this.canvas_preview.width, this.canvas_preview.height);
};

/**
 * 
 * @returns {Boolean}
 */
Clayer.prototype.redraw = function(bool) {
	if (typeof(bool) === 'boolean') {
		this.need_redraw = bool;
	}
	if (!this.need_redraw) {
		return false;
	}
	if (this.globalCompositionOperation != this.composition) {
		this.ctx.globalCompositeOperation = this.composition;
	}
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	if (this.frags.length > 10) {
		;//this.stack_frags(0, 5);
	}
	for ( var i = 0; i < this.frags.length; i++) {
		var f = this.frags[i];
		var canvas = f.cCanvas.data;
		this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height,
				f.position.x, f.position.y, canvas.width, canvas.height);
	}
	this.redraw_preview();
	this.need_redraw = false;
	return true;
};

/**
 * 
 */
Clayer.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.frags = new Array();
};

/**
 * 
 * @returns
 */
Clayer.prototype.get_canvas = function() {
	this.redraw();
	return this.canvas;
};

Clayer.prototype.stack_frags = function(p_start, p_end) {
	var start = p_start;
	var end = p_end;
	if (p_start > p_end) {
		start = p_end;
		end = p_start;
	}
	var nf = new Cdraw_frag(this.canvas.width, this.canvas.height);
	var tctx = nf.getContext('2d');
	for (var i = start; i <= end; i++) {
		var f = this.frags[i];
		var canvas = f.canvas.data;
		tctx.drawImage(canvas, 0, 0, canvas.width, canvas.height,
				f.position.x, f.position.y, canvas.width, canvas.height);
	}
	//console.log(.canvas.canvas.toDataURL());
	this.frags.splice(start, 0, nf);
	this.frags.splice(start, end);
	//this.frags.remove(start, end);
	
	
};
/**
 * 
 * @param canvas
 * @param sx
 * @param sy
 * @param swidth
 * @param sheight
 * @param tx
 * @param ty
 */
Clayer.prototype.drawImage = function(canvas, sx, sy, swidth, sheight, tx,
		ty) {
	var frag = new Cdraw_frag(this, new Object({
		x : sx,
		y : sy
	}), swidth, sheight);
	frag.drawImage(canvas, sx, sy, swidth, sheight, tx, ty);
	this.frags.push(frag);
	try {
		this.ctx.drawImage(canvas, sx, sy, swidth, sheight, sx, sy, swidth,
				sheight);
		
	} catch (e) {
		console.error(e);
	};
};



