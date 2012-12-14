(function(window, graphit, console, undefined) {
	
	var modulePath = 'lib/parameter/enum/type';
	
	var Module = {
			'numeric' : 1,
			'select' : 2,
			'checkbox' : 3
	};
	console.log('Module', Module)
	graphit.export(modulePath, Module);
	
})(window,graphit, console);