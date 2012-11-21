function Cbinary_file(options) {
    options.className = 'Cbinary_file';
    options.label = 'binaryfile';
    Cobject.call(this, options, ['src', 'callback_success', 'callback_error', 'responseType']);
    this.responseType = this.responseType || 'arraybuffer';
    this.response = null;
    if (this.src) {
	this.load(this.src);
    }

}

Cbinary_file.prototype = Object.create(Cobject.prototype);
Cbinary_file.prototype.constructor = new Cobject();

Cobject.prototype.load = function(src) {
  if (!src) {
      console.error('Trying to load undefined src');
      return null;
  }  
  console.log('Loading file: ' + src);
  this.src = src;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', src, true);
  xhr.responseType = 'arraybuffer';
  
  var that = this;
  xhr.onload = function(e) {
      //var ui8a = new Uint8Array(this.response);
      that.response = this;
      if ('callback_success' in that) {
	  that.callback_success.call(that, this);
      }
  };
  xhr.onerror = function(e) {
      console.log(this.className + ' failed to load file', this.src);
      if ('callback_error' in that) {
	  that.callback_error(that, this);
      } 
  };
};



