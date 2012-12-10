function msg(action, msg) {
	self.postMessage({type: 'image', action: action, msg: msg});
}
/**
 * Class  Cwebworker_image
 * 05:53:00 / 8 déc. 2012 [Graphit Nosferat.us] sho 
 */
function Cwebworker_image(options) {
	var that = this;
	options = options || {};
	options.className = "Cwebworker_image";
	options.label = "Cwebworker_image";
	self.onmessage = function(event) {
		if (event.data.action == 'start') {
			that.start();
			return;
		} 
		console.error('Unknow message action', event, action);
	};
}

/**
 *
 */
Cwebworker_image.prototype.start = function() {
	msg('start');
	var str = '';
	for(var i=0; i < 10000; i++) { str+='ezokfpzfe'; str = '';}
	msg('stop');
};


new Cwebworker_image();