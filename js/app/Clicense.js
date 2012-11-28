function Clicense() {
	this.logo = 'img/gplv3-88x31.png';
	this.text = 'http://shojs.github.com/graphit/license-gpl3.txt';
	this.rootElm = null;
	this.dialog_options = {
			width: 400
	};
}

Clicense.prototype.dom_build = function() {
	if (this.rootElm) { return this; }
	var $r = $('<div title="License"/>');
	$r.addClass('about ');
	var $g = $('<div />');
	$g.addClass('group-license');
	var img = $('<img />');
	img[0].src = this.logo;
	$g.append(img);
	$g.append('<p>Source code: <a href="#code" onclick="window.open(\'http://github.com/shojs/graphit/\'); return false;">github</a></p>');
	$g.append('<p>Documentation: <a href="#doc" onclick="window.open(\'http://github.com/shojs/graphit/wiki\');return false;">Wiki</a></p>');
	$g.append('<p><img src="img/stock-wilber-eek-64.png">&nbsp;All icons comes from the <a href="http://www.gimp.org">Gimp</a> project.</p>');
	$g.append('<h6>License</h6>');
	var $txt = $('<p />');
	$txt.addClass('text');
	$txt.append("" +
"                    GNU GENERAL PUBLIC LICENSE" + 
"                       Version 3, 29 June 2007" +
"\n"+
"\n"+
" Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>" +
" Everyone is permitted to copy and distribute verbatim copies" +
" of this license document, but changing it is not allowed.");
	$g.append($txt);
	try {
	    $txt.load(this.text);
	} catch(e) {
	    console.error('Cannot load full license', e);
	    throw e;
	}
	var button = document.createElement('button');
	$(button).append('Close');
	$(button).button();
	$(button).click(function(e, ui) {
		$r.dialog('close');
	});
	$g.append(button);
	$r.append($g);
	this.rootElm = $r;
	return this;
};

Clicense.prototype.dom_get = function() {
	return this.dom_build().rootElm; 
};