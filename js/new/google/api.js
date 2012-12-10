
"use strict";

/**
 * Google API
 * @param cfg
 * @returns
 */
function Cgoogle(cfg) {
	console.log('Creating Cgoogle object', cfg);
	this.cfg = cfg;
	this.token = null;
	this.drive = new Cgoogle_drive({parent: this});
}

Cgoogle.prototype.login = function(callback) {
	console.log('Trying to login to Google API');
	var that = this;
	oauth2.login(this.cfg, 
		function(token) {
			console.log('We are logged to Google API');
			that.token = token;
			if (callback && typeof callback == 'function') {
				callback.call(that, token);
			}
		},
		function(error) {
			this.token = null;
			console.error('Cannot log to the Google API');
		}
	);
};

/**
 * 
 * @returns
 */
Cgoogle.prototype.expiresIn = function() {
	return oauth2.expiresIn(this.cfg);
};

/**
 * 
 * @param param
 */
Cgoogle.prototype.request = function(request) {
	var that = this;
	var pat = /^(GET|POST|PUT|DELETE)$/;
	if (!pat.exec(request.method)) {
		throw 'cgoogle_request_invalid_method';
	}
	var url = 'https://www.googleapis.com/' + request.url;
	url += '?key=' + encodeURIComponent(this.token);
	console.log('GoogleRequest', request.method, url);
	var handler = function() {
		if(this.readyState == this.DONE) {
			    if(this.status != 200) {
			    	console.error('Error: in request', this.responseText, this);
			    	throw 'cgoogle_request_error';
			    }
			    if ('success' in request && typeof request.success == 'function') {
			    	request.success.call(that, JSON.parse(this.response));
			    }
		}
		console.log('Processing', this);
	};
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = handler;
	xhr.open(request.method, url);
	xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
	if (request.method == 'POST') {
		xhr.setRequestHeader('Content-Type', 'application/octet-stream');
		//xhr.setRequestHeader('Content-Transfer-Encoding', 'base64');
		for (label in request.headers) {
			xhr.setRequestHeader(label, request.headers[label]);
		}
		xhr.send(request.body)
	} else {
		xhr.send();
	}
};

/**
 * Google API / Drive
 */
var Cgoogle_drive = function(options) {
	if (!options || !('parent' in options) || !(options.parent instanceof Cgoogle)) {
		throw 'cgoogle_drive_no_parent';
	}
	this.parent = options.parent;
};

/**
 * 
 * @param param
 */
Cgoogle_drive.prototype.list = function(param) {
	var that = this;
	var success = function(data) {
		param.success.call(that, new Cgoogle_drive_directory({parent: null, data: data}));
	};
	this.parent.request({ 
		method: 'GET', 
		url: 'drive/v2/files', 
		success: success,
		error: param.error
	});
};

Cgoogle_drive.prototype.insert = function(request) {
	var success = function(data) {
		console.log('Insert', data);
		request.success.call(this, data);
	};
	this.parent.request({
		method: 'POST',
		url: 'upload/drive/v2/files',
		success: success,
		error: request.error,
		request: request,
	});
};

/*
 * Google drive file
 */
function Cgoogle_drive_file (options) {
	this.parent = options.parent;
	this.data = options.data;
}

Cgoogle_drive_file.prototype.dom_get = function(id) {
	var that = this;
	var r = $('<div />');
	var i = $('<img />');
	console.log('url', this.data.thumbnailLink);										
	i.src = this.data.thumbnailLink;
	r.append(i);
	var a = $('<a />');
	a.attr('href', '#');
	a.click(function() {
		var s = $(this);
		s.parents(id).empty();
		s.load(that.get('alternateLink'));
	});
	a.append(this.get('title'));
	r.append(a);
	return r;
};

Cgoogle_drive_file.prototype.get = function(key) {
	if (!(key in this.data)) {
		throw 'google_drive_invalid_key', key;
	}
	return this.data[key];
};

/**
 * 
 * @returns {String}
 */
Cgoogle_drive_file.prototype.to_s = function() {
	var str = '[Cgoogle_drive_file]' + "\n";
	str += ' name: ' + this.get('title') + "\n";
	str += ' kind: ' + this.get('kind') + "\n";
	return str;
};

/**
 * Google drive directory
 */
function Cgoogle_drive_directory(options) {
	this.parent = options.parent;
	this.data = options.data;
};

/**
 * 
 * @returns {String}
 */
Cgoogle_drive_directory.prototype.to_s = function() {
	var str = '[Cgoogle_drive_directory]' + "\n";
	str += ' name: ' + this.get('title') + "\n";
	str += ' kind: ' + this.get('kind') + "\n";
	return str;
};

Cgoogle_drive_directory.prototype.get = function(key) {
	if (!(key in this.data)) {
		throw 'google_drive_invalid_key', key;
	}
	return this.data[key];
};

/**
 * 
 * @returns
 */
Cgoogle_drive_directory.prototype.dom_get = function() {
	var r = $('<div />');
	r.append('<div>' + this.get('title') + '</div>');
	return r;
};

/**
 * 
 * @param callback
 */
Cgoogle_drive_directory.prototype.list = function(callback) {
	for (var i = 0; i < this.data.items.length; i++) {
		var file = this.data.items[i];
		if (file.mimeType == "application/vnd.google-apps.folder") {
			callback.call(this, new Cgoogle_drive_directory({parent: this, data: file}));
		} else {
			callback.call(this, new Cgoogle_drive_file({parent: this, data: file}));
		}
	}
};
