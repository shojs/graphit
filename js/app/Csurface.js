/*******************************************************************************
 * 
 * @param parent
 * @returns
 */
function Cdraw_buttons(parent) {
	this.parent = parent;
	this.build();
	this.rootElm;
}

Cdraw_buttons.prototype.build = function() {
	var that = this;
	var root = document.createElement('button');
	var $r = $(root);
	$r.button({
		label : 'clear'
	});
	$r.click(function() {
		var msg = document.createElement('div');
		var $m = $(msg);
		$m.append('<p>Dou you want to clear your drawing ?</p>');
		$m.dialog({
			buttons : {
				Ok : function() {
					that.parent.clear();
					$(this).dialog("close");
				},
				Cancel : function() {
					$(this).dialog("close");
				}
			}
		});
	});
	this.rootElm = root;
};

Cdraw_buttons.prototype.get_dom = function() {
	return this.rootElm;
};

/*******************************************************************************
 * 
 * @param width
 * @param height
 * @returns
 */
function Csurface(id, width, height) {
	this.id = id;
	this.width = width;
	this.height = height;
	this.layer_manager = new Clayer_manager(this);
	this.layer_manager.add(new Clayer(this.layer_manager, E_LAYERLABEL.mouse));
	this.layer_manager.add(new Clayer(this.layer_manager, E_LAYERLABEL.prefrag));
	this.layer_manager.add(new Clayer(this.layer_manager));
	this.mouse = new Cmouse_tracker(this, {
		callback_move: function() { console.log('mouse move'); },
		callback_track: function() { console.log('mouse track'); },
	});
	this.rootElm = null;
	this.cCanvas = new Ccanvas(this.width, this.height);
	this.cCanvas.clear(new Ccolor(255,0,0,1));
	this.cTools = null;
	this.cGraph = null;
	this.build();
}

Csurface.prototype.set_current_layer = function(layer) {
	this.layer_manager.current_layer = layer;
};

Csurface.prototype.build = function() {
	var that = this;
	var root = document.createElement('div');
	var $r = $(root);

	$r.addClass('surface ' + DRAWGLOB.css_draggable_class);
	helper_build_header($r, ' ', 'Surface');
	var $g = $(document.createElement('div'));
	var canvas = this.cCanvas.data;
	var $c = $(canvas);
	$c.attr('width', this.width);
	$c.attr('height', this.height);
	$c.addClass('canvas not-draggable');
	$c.mousedown(function(e) {
		that.callback_mousedown(e, that);
	});
	$c.mouseup(function(e) {
		that.callback_mouseup(e, that);
	});
	$c.mousemove(function(e) {
		that.callback_mousemove(e, that);
	});
	$c.mouseout(function(e) {
		if (that.mouse.is_pushed()) {
			that.mouse.paused = true;
			//that.callback_mouseup(e, that);
		}
	});
	$c.mouseover(function(e) {
		if (that.mouse.is_pushed()) {
			that.mouse.paused = false;
			//that.callback_mouseup(e, that);
		}
	});
	this.dom_mouse = this.mouse.get_dom();
	$g.append($c);
	$r.append($g);
	this.build_buttons = new Cdraw_buttons(this);
	$g = $(document.createElement('div'));
	$g.append(this.build_buttons.get_dom());
	$(document).bind('keydown', 'Ctrl+z', function() {
		that.undo();
	});
	this.rootElm = $(root);
};

Csurface.prototype.undo = function() {
	this.layer_manager.current_layer.discard_frag();
	this.layer_manager.current_layer.redraw();
	this.redraw();
};

Csurface.prototype.redraw = function() {
	var tool = this.cTools.selected;
	var canvas = this.cCanvas.data;
	var tctx = canvas.getContext('2d');
	tctx.clearRect(0, 0, canvas.width, canvas.height);
//	tctx.fillStyle = 'rgba(255,0,0,1)';
//	tctx.fillRect(0,0, canvas.width, canvas.height);
	for ( var i = 0; i < this.layer_manager.layers.length; i++) {
		this.layer_manager.layers[i].redraw(true);
		tctx.drawImage(this.layer_manager.layers[i].canvas, 0, 0,
				canvas.width, canvas.height);
	}
	tctx.save();
	if (tool.globalCompositeOperation) {
		tctx.globalCompositeOperation = tool.globalCompositeOperation;
	}
	tctx.drawImage(this.layer_manager.special_layers.prefrag.canvas, 0, 0,
			canvas.width, canvas.height);
	tctx.restore();
};

Csurface.prototype.clear = function() {
	for ( var i = 0; i < this.layer_manager.layers.length; i++) {
		this.layer_manager.layers[i].clear();
	}
	this.redraw();
};

Csurface.prototype.callback_mousedown = function(e, obj) {
	if (this.mouse.is_pushed()) {
		console.warn("Mouse already pushed");
		return false;
	}
	this.mouse.push();
	this.cGrapher.start();
	return true;
};

Csurface.prototype.callback_mouseup = function(e, obj) {
	if (!this.mouse.is_pushed()) {
		console.warn('Mouse not pushed');
		return false;
	}
	this.cGrapher.stop();
	this.redraw();
	this.mouse.release();
	return true;
};

Csurface.prototype.callback_mousemove = function(e, obj) {
	var $o = $(obj.cCanvas.data).offset();
	this.mouse.move(e.pageX - $o.left, e.pageY - $o.top);
};

Csurface.prototype.get_dom = function() {
	return this.rootElm;
};

Csurface.prototype.save_as_json = function() {
	
	var data = {
			label: this.label,
			layers: [],
	};
	for (var i = 0; i < this.layer_manager.layers.length; i++) {
		data.layers.push(this.layer_manager.layers[i].to_json());
	}
	var w = window.open(this.cCanvas.data.toDataURL());
	//w.document.location.href=JSON.stringify(data);
	console.log(data);
	return data;
};