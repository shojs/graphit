/**
 * Class  Csplashscreen
 * 03:57:10 / 8 déc. 2012 [Graphit Nosferat.us] sho 
 */
function Csplashscreen(options) {
	options = options || {};
	options.className = "Csplashscreen";
	options.label = "Csplashscreen";
	Cobject.call(this, options, []);
}

/* Inheritance */
Csplashscreen.prototype = Object.create(Cobject.prototype);
Csplashscreen.prototype.constructor = new Cobject();

/**
 *
 */
Csplashscreen.prototype.dom_build = function() {
	var r = $('<div title="splashscreen" />');
	var img = $('<img />');
	img.attr('src', 'images/splashscreen.png');
	img.attr('width', 600);
	img.attr('height', 200);
	r.append(img);
	this.rootElm = r;
	return this;
};
