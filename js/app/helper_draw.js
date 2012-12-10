/**
 * Drawing circle on a given canvas
 * 
 * @param canvas
 * @param x
 * @param y
 * @param size
 * @param color
 * @return bool
 */

var cDraw = {
    circle : function(options) {
	var ctx = options.dcanvas.getContext('2d');
	if (!ctx) {
	    console.error('Cannot aquiere context');
	    return false;
	}
	ctx.save();
	ctx.beginPath();
	//ctx.fillStyle = options.color.to_rgba();
	ctx.arc(options.x, options.y, options.r, 0, Math.PI * 2, true);

	if (options.fillStyle) {
	    ctx.fillStyle = options.fillStyle.to_rgba();
	    ctx.fill();
	}
	if (options.lineWidth) {
	    ctx.lineWidth = options.lineWidth;
	}
	if (options.strokeStyle) {
	    //console.log('STROKE');
	    ctx.strokeStyle = options.strokeStyle.clone().set('a', 1).to_rgba();
	    ctx.stroke();
	}
	ctx.closePath();
	ctx.restore();
	return true;
    }
};

//function helper_draw_circle(canvas, x, y, r, color) {
//    if (canvas === undefined || x === undefined || y == undefined) {
//	console.error('Invalid parameters');
//	return 0;
//    }
//    // console.log(canvas);
//    var ctx = canvas.ctx;// getContext('2d');
//    if (!ctx) {
//	console.error('Cannot get context 2d from canvas');
//	console.error(canvas);
//	return 0;
//    }
//    if (!color) {
//	color = 'rgba(0,0,0,1)';
//    }
//    if (!r) {
//	r = 1;
//    }
//    ctx.save();
//    ctx.beginPath();
//    ctx.fillStyle = color;
//    ctx.arc(x, y, r, 0, Math.PI * 2, true);
//    ctx.closePath();
//    ctx.fill();
//    ctx.restore();
//    return 1;
//}