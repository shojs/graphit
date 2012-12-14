(function(window, graphit, console, undefined) {

	'use strict';

	var modulePath = 'app/brush/tools';
	var Ccanvas = graphit.import('lib/canvas');
	var Ccolor = graphit.import('lib/color');
	
	/**
	 * @constructor
	 */
	var Module = {
		circle : {
			width : 100,
			height : 100,
			/**
			 * @constructor
			 * @returns {Boolean}
			 */
			callback_update : function() {
				var Ctoolbox = graphit.import('app/toolbox');
				var toolbox = this.parent.parent;
				if (!(toolbox instanceof Ctoolbox)) {
					console.error('Brush parent of parent must be a toolbox');
					return false;
				}
				var color = toolbox.fg_color.color.clone();
				var tool = toolbox.selected;
				if ('opacity' in tool.parameters) {
					color.a = tool.parameters.opacity.value;
				}
				var dsize = this.cCanvas.data.width / 2;
				this.cCursor = new Ccanvas({
					width : this.cCanvas.width,
					height : this.cCanvas.height
				});

				cDraw.circle({
					dcanvas : this.cCursor.data,
					x : dsize,
					y : dsize,
					r : dsize,
					fillStyle : new Ccolor({
						r : 255,
						a : 1
					}),
					strokeStyle : new Ccolor({
						r : 255,
						a : 1
					}),
					lineWidth : 1
				});
				cDraw.circle({
					dcanvas : this.cCanvas.data,
					x : dsize,
					y : dsize,
					r : dsize,
					fillStyle : color
				});
			}
		},
		scircle : {
			width : 100,
			height : 100,
			/**
			 * @constructor
			 * @returns {Boolean}
			 */
			callback_update : function() {
				var toolbox = this.parent.parent;
				if (!(toolbox instanceof Ctoolbox)) {
					console.error('Brush parent of parent must be a toolbox');
					return false;
				}
				var color = toolbox.fg_color.color.clone();
				var tool = toolbox.selected;
				if (tool && 'opacity' in tool.parameters) {
					color.a = tool.parameters.opacity.value;
				}
				var dsize = this.cCanvas.data.width / 2;
				this.cCursor = new Ccanvas({
					width : this.cCanvas.width,
					height : this.cCanvas.height
				});

				cDraw.circle({
					dcanvas : this.cCursor.data,
					x : dsize,
					y : dsize,
					r : dsize,
					fillStyle : new Ccolor({
						r : 255,
						a : 1
					}),
					strokeStyle : new Ccolor({
						r : 255,
						a : 1
					}),
					lineWidth : 1
				});
				cDraw.circle({
					dcanvas : this.cCanvas.data,
					x : dsize,
					y : dsize,
					r : dsize,
					strokeStyle : color
				});
			}
		},
		rectangle : {
			width : 100,
			height : 100,
			/**
			 * @constructor
			 * @returns {Boolean}
			 */
			callback_update : function() {
				var toolbox = this.parent.parent;
				if (!(toolbox instanceof Ctoolbox)) {
					console.error('Brush parent of parent must be a toolbox');
					return false;
				}
				var color = toolbox.fg_color.color.clone();
				var tool = toolbox.selected;
				if (tool && 'opacity' in tool.parameters) {
					color.a = tool.parameters.opacity.value;
				}
				var size = this.cCanvas.data.width;
				this.cCursor = new Ccanvas({
					width : this.cCanvas.width,
					height : this.cCanvas.height
				});

				var ctx = this.cCursor.getContext();
				ctx.save();
				ctx.clearRect(0, 0, size, size);
				ctx.strokeStyle = color.to_rgba();
				ctx.strokeRect(0, 0, size, size);
				ctx.restore();
				ctx = this.cCanvas.getContext();
				ctx.save();
				ctx.clearRect(0, 0, size, size);
				ctx.fillStyle = color.to_rgba();
				ctx.fillRect(0, 0, size, size);
				ctx.restore();
			}
		}
	};



	graphit.export(modulePath, Module);

})(window, graphit, console);
