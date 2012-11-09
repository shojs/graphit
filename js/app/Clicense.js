function Clicense() {
	this.logo = 'img/gplv3-88x31.png';
	this.text = 'http://shojs.github.com/graphit/license-gpl3.txt';
	this.rootElm = null;
}

Clicense.prototype.dom_build = function() {
	if (this.rootElm) { return this; }
	var root = document.createElement("div");
	var $r = $(root);
	$r.addClass('draggable')
	$r.append('<h6 class="header">GNU</h6>');
	var img = document.createElement('img');
	img.src = this.src;
	$r.append(img);
	var txt = document.createElement('p');
	$(txt).addClass('text');
	$(txt).append('loading...');
	$(txt).load(this.text);
	$r.append(txt);
	this.rootElm = $r;
	return this;
};

Clicense.prototype.dom_get = function() {
	return this.dom_build().rootElm; 
};