(function() {
	var Cobject = graphit.getClass('Cobject');
	
	var Ccore = function(options) {
		options = options || {};
		options.className = 'Ccore';
		options.label = options.label || 'core';
		options.language = options.language || 'en';
		Cobject.call(this, options, ['language']);
	};
	
	Ccore.prototype = Object.create(Cobject.prototype);
	Ccore.prototype.constructor = new Cobject();
	graphit.core = new Ccore({language: 'fr'});
	graphit.setClass('Ccore', Ccore);
	
})(graphit);