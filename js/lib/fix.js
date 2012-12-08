
/**
 * On IE console is not set if not opened...
 */
if (!('console' in window)) {
	var stub = function() { ; };
	window.console = {
		log : stub,
		info : stub,
		warn : stub,
		error : stub,
		assert : stub
	};
}
