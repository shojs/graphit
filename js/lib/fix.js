
/**
 * On IE console is not set if not opened and debug doesn't exists
 */
(function() {
	if (!('console' in window)) { window.console = {}; }
	var kind = ['log', 'info', 'warn', 'error', 'assert', 'debug'];
	var stub = function() { ; };
	for (var i = 0; i < kind.length; i++) {
		if (kind[i] in window.console) { continue; }
		window.console[kind[i]] = stub;
	}
})();
