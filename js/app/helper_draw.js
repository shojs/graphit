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
function helper_draw_circle(canvas, x, y, r, color) {
	if (canvas === undefined || x === undefined || y == undefined) {
		console.error('Invalid parameters');
		return 0;
	}
	var ctx = canvas.getContext('2d');
	if (!ctx) {
		console.error('Cannot get context 2d from canvas');
		console.error(canvas);
		return 0;
	}
	if (!color) {
		color = 'rgba(0,0,0,1)';
	}
	if (!r) {
		r = 1;
	}
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(x, y, r, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
	return 1;
}