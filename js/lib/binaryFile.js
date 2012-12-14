(function(window, graphit, console, undefined) {

	var modulePath = 'lib/binaryFile';
	
	var Cobject = graphit.import('lib/object');
	
	/**
	 * @constructor
	 * @param options
	 * @returns
	 */
	function Module(options) {
		options = options || {};
		options.className = modulePath;
		options.label = 'binaryfile';
		this.headers = [];
		this.FH = {};
		Cobject.call(this, options, [
				'src', 'callback_success', 'callback_error', 'responseType'
		]);
		this.responseType = this.responseType || 'arraybuffer';
		this.response = null;

		this.loaded = false;
		this.error = "";
		if (this.src) {
			this.load(this.src);
		}
	}

	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	Module.prototype.set_src = function(src) {

	};

	Module.prototype.load = function(src) {
		if (!src) {
			console.error('Trying to load undefined src');
			return null;
		}
		if (window.graphit.debug > 4) console.log('Loading file: ' + src);
		this.src = src;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', src, true);
		xhr.responseType = 'arraybuffer';
		var that = this;
		xhr.onload = function(e) {
			that.response = this;
			if ('success' in that.callback) {
				that.callback.success.call(that, this);
			}
		};
		xhr.onerror = function(e) {
			console.error(this.className + ' failed to load file', this.src);
			if ('error' in that.callback) {
				that.callback.error(that, this);
			}
		};
		xhr.send();
	};

	Module.prototype.header = function(name) {
		if (!(name in this.FH)) {
			console.error('No property <<', name, '>> in header');
			return '';
		}
		return this.headers[this.FH[name]].value;
	};

	graphit.export(modulePath, Module);

})(window, graphit, console);
