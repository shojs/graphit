function Clicense() {
	this.logo = 'img/gplv3-88x31.png';
	this.text = 'http://shojs.github.com/graphit/license-gpl3.txt';
	this.rootElm = null;
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
" of this license document, but changing it is not allowed." +
"\n"+
"\n"+
"                            Preamble" +
"\n"+
"  The GNU General Public License is a free, copyleft license for" +
"software and other kinds of works." +
"\n"+
"\n"+
"  The licenses for most software and other practical works are designed" +
"to take away your freedom to share and change the works.  By contrast," +
"the GNU General Public License is intended to guarantee your freedom to" +
"share and change all versions of a program--to make sure it remains free" +
"software for all its users.  We, the Free Software Foundation, use the" +
"GNU General Public License for most of our software; it applies also to" +
"any other work released this way by its authors.  You can apply it to" +
"your programs, too." +
"\n"+
"\n"+
"  When we speak of free software, we are referring to freedom, not" +
"price.  Our General Public Licenses are designed to make sure that you" +
"have the freedom to distribute copies of free software (and charge for" +
"them if you wish), that you receive source code or can get it if you" +
"want it, that you can change the software or use pieces of it in new" +
"free programs, and that you know you can do these things." +
"\n"+
"  To protect your rights, we need to prevent others from denying you" +
"these rights or asking you to surrender the rights.  Therefore, you have" +
"certain responsibilities if you distribute copies of the software, or if" +
"you modify it: responsibilities to respect the freedom of others." +
"");
	$g.append($txt);
	try {
	    $txt.load(this.text);
	} catch(e) {
	    console.error('Cannot load full license', e);
	}
	var button = document.createElement('button');
	$(button).append('Close');
	$(button).button();
	$(button).click(function(e, ui) {
		$('.about').remove();
	});
	$g.append(button);
	$r.append($g);
	this.rootElm = $r;
	return this;
};

Clicense.prototype.dom_get = function() {
	return this.dom_build().rootElm; 
};