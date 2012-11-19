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
function Clayer(parent, label, p_composite_operation) {
    var composite_operation = p_composite_operation;
    if (!composite_operation) {
	composiste_operation = Ecomposite_operation['source-over'];
    }
    Cobject.call(this, {
	parent : parent,
	label : label,
	composite_operation : composite_operation,
	visible: false,
	need_redraw: true,
    }, ['parent', 'label', 'composite_operation', 'need_redraw', 'visible']);
    this.uid = UID.get();
    this.frags = new Array();
    // TODO: it's a bit ugly to get layer size this way
    var width = parent.parent.width;
    var height = parent.parent.height;
    this.cCanvas = new Ccanvas(width, height);
    this.ctx = this.cCanvas.getContext('2d');
    this.rootElm = null;
};
Clayer.prototype = Object.create(Cobject.prototype);
Clayer.prototype.constructor = new Cobject();

Clayer.prototype.clone = function() {
    var canvas = this.cCanvas.data;
    var l = new Clayer(this.parent, this.label, this.composition);
    l.visible = this.visible;
    l.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    l.need_redraw = this.need_redraw;
    l.rootElm = this.rootElm;
    return l;
};

/**
 * 
 * @returns
 */
Clayer.prototype.discard_frag = function() {
    // console.log('length: ' + this.frags.length);
    this.need_redraw = true;
    return this.frags.pop();
};

/**
 * 
 */
Clayer.prototype.dom_get = function(index) {
    this.dom_build();
    return this.rootElm;
},

Clayer.prototype.set_visible = function(b) {
    if (b) {
	this.visible = true;
    } else {
	this.visible = false;
    }
};

/**
 * 
 * @returns {Clayer}
 */
Clayer.prototype.dom_build = function() {
    if (this.rootElm) {
	return this;
    }
    // console.log('index', index);
    var that = this;
    var root = document.createElement('li');
    var $r = $(root);
    $r.attr('id', this.uid);
    $r.addClass('layer');
    var button = new Cimage({
	src : 'img/16x16_eye.png',
	width : '16px',
	height : '16px',
	callback_click : function(obj) {
	    console.log("Clicked: ", obj);
	}
    });
    var table = document.createElement('table');
    var $t = $(table);
    ;
    var $tr = $(document.createElement('tr'));
    var $td = $(document.createElement('td'));

    $td.append(button.dom_get());
    $tr.append($td);
    $td = $(document.createElement('td'));
    var $txt = $(document.createTextNode('Layer - ' + this.label));

    $td.append($txt);
    $td.editInPlace({
	callback : function(original_element, html, originals) {
	    that.label = html;
	    return html;
	}
    });
    $td.addClass('label');
    $tr.append($td);
    $td = $(document.createElement('td'));
    $td.addClass('preview');
    var canvas = document.createElement('canvas');
    this.canvas_preview = canvas;
    var width = 100;
    var height = width * (this.cCanvas.data.height / this.cCanvas.data.width);
    canvas.width = width;
    canvas.height = height;
    var $c = $(canvas);
    $td.click(function() {
	var e = $(this).parents('.group-layers');
	console.log(e);
	e.find('.layer').removeClass(
		'selected');
	$(this).parents('.layer').addClass('selected');
	that.parent.select(that);
    });
    $td.append($c);
    $tr.append($td);
    $td = $(document.createElement('td'));
    var b_up = new Cimage({
	src : 'img/16x16_up.png',
	width : 16,
	height : 16,
	callback_click : function(obj) {
	    that.parent.move_up(that.uid);
	}
    });
    $td.append(b_up.dom_get());
    var b_down = new Cimage({
	src : 'img/16x16_down.png',
	width : 16,
	height : 16,
	callback_click : function(obj) {
	    that.parent.move_down(that.uid);
	}
    });
    $td.append(b_down.dom_get());
    var b_trash = new Cimage({
	src : 'img/16x16_trash.png',
	width : 16,
	height : 16,
	callback_click : function(obj) {
	    var $s = $(this).parents('li.layer');
	    if ($s) {
		$r.remove();
		that.parent.remove(that);
	    } else {
		console.error('Cannot remove layer element');
	    }
	}
    });
    $tr.append($td);
    $td = $(document.createElement('td'));
    $td.addClass('options');
    $td.append(b_trash.dom_get());
    $tr.append($td);
    $t.append($tr);
    $r.append($t);
    this.rootElm = $r;
    return this;
};

/**
 * 
 */
Clayer.prototype.redraw_preview = function() {
    var ctx = this.canvas_preview.getContext('2d');
    var scanvas = this.cCanvas.data;
    ctx.clearRect(0, 0, scanvas.width, scanvas.height);
    ctx.drawImage(scanvas, 0, 0, scanvas.width, scanvas.height, 0,
	    0, this.canvas_preview.width, this.canvas_preview.height);
};

/**
 * 
 * @returns {Boolean}
 */
Clayer.prototype.redraw = function(bool) {
    if (typeof (bool) === 'boolean') {
	this.need_redraw = bool;
    }
    if (!this.need_redraw) {
	return false;
    }
    this.ctx.clearRect(0, 0, this.cCanvas.data.width, this.cCanvas.data.height);
    if ('compositeOperation' in this) {
	this.ctx.compositeOperation = this.compositeOperation;
    }
    if (this.frags.length > 10) {
	;
    }
    var dwidth = this.cCanvas.data.width;
    var dheight = this.cCanvas.data.height;
    for ( var i = 0; i < this.frags.length; i++) {
	var f = this.frags[i];
	var scanvas = f.cCanvas.data;
	var height = scanvas.height;
	var width = scanvas.width;
	var x = f.position.x;
	if (x < 0) {
	    x = 0;
	} else if ((x + width) > dwidth) {
	    width = dwidth - x;
	}
	var y = f.position.y;
	if (y < 0) {
	    y = 0;
	} else if ((y + height) > dheight) {
	    height = dheight - y;
	}
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.rect(x, y, width, height);
	this.ctx.clip();
	if (f.downCompositeOperation) {
	    this.ctx.globalCompositeOperation = f.downCompositeOperation;
	} else {
	    this.ctx.globalCompositeOperation = 'source-over';
	}

	this.ctx.drawImage(scanvas, 0, 0, width, height, x, y, width, height);
	this.ctx.restore();
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
    for ( var i = start; i <= end; i++) {
	var f = this.frags[i];
	var canvas = f.cCanvas.data;
	tctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, f.position.x,
		f.position.y, canvas.width, canvas.height);
    }
    this.frags.splice(start, 0, nf);
    this.frags.splice(start, end);
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
Clayer.prototype.drawImage = function(canvas, sx, sy, swidth, sheight, tx, ty,
	compositeOperation) {
    var frag = new Cfrag(this, new Object({
	x : sx,
	y : sy
    }), swidth, sheight);
    frag.drawImage(canvas, sx, sy, swidth, sheight, 0, 0);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(sx, sy, swidth, sheight);
    this.ctx.strokeRect(sx, sy, swidth, sheight);
    this.ctx.clip();
    if (compositeOperation) {
	this.ctx.globalCompositeOperation = compositeOperation;
	frag.downCompositeOperation = compositeOperation;
    }
    this.frags.push(frag);
    // FIXME: Invalid parameters cause exception on safari
    //console.log(sx, sy, swidth, sheight, tx, ty);
    this.ctx.drawImage(frag.cCanvas.data, 0, 0, swidth, sheight, sx, sy,
	    swidth, sheight);
    this.ctx.restore();
    this.redraw();
};

Clayer.prototype.to_json = function() {
    return {
	label : this.data,
	data : this.cCanvas.data.toDataURL(),
    };
};
