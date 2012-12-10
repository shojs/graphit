/**
 * Specification of gbr file found at
 * https://github.com/mskala/noxcf-gimp/blob/master/devel-docs/gbr.txt

The GIMP Paintbrush File Format Version 1 (.gbr)
------------------------------------------------

Based on examples and code, it seems that v1 is like v2, but it is
lacking bytes 20 - 27 (no magic or spacing info), and thus having
as last header field:

Bytes 20 - (header_size - 1):
    Type: char *
    Value: undefined encoding string - name of brush

GBR v1 is deprecated and should never be used to save new brushes.



The GIMP Paintbrush File Format Version 2 (.gbr)
------------------------------------------------

HEADER
------

Bytes 0  - 3:  header_size: 
	Type: 32 bit unsigned int
	Value: size of brush header (28) + length of brush name

Bytes 4  - 7: version
	Type: 32 bit unsigned int 
	Value: The file format version.

Bytes 8  - 11: width
	Type: 32 bit unsigned int 
	Value: Brush width

Bytes 12 - 15: height
	Type: 32 bit unsigned int 
	Value: Brush height

Bytes 16 - 19: bytes
	Type: 32 bit unsigned int 
	Value: Colour depth of brush. 
	1 = greyscale, 4 = RGBA

Bytes 20 - 23: magic_number
	Type: 32 bit unsigned int 
	Value: GIMP brush magic number.
	('G' << 24) + ('I' << 16) + ('M' << 8) + 'P'

Bytes 24 - 27: spacing
	Type: 32 bit unsigned int 
	Value: Default spacing to be used for brush. Percentage
	of brush width.

Bytes 28 - (header_size - 1):
	Type: char *
	Value: UTF-8 string - name of brush


BODY
----
	Size: width * height * bytes
	Type: uchar *
	Value: Pixel values (row-first) for brush



The GIMP Paintbrush File Format Version 3 (.gbr)
------------------------------------------------

This changed GIMP brush format was introduced by the FilmGimp or
CinePaint developers without notifying the GIMP developers. We've
added support for reading these brushes. The format is very similar
to version 2 but uses the bytes field as a data format identifier. 
It seems the only format identifier in use is 18 which corresponds
to 16bit floats. If you encounter brushes with a different data
format, please let the GIMP developers know.
 
 */

function Cfile_GBR(options) {
	Cbinary_file.call(this, options);
	/**
	 * Installing our callbacks , keeping original with preceding _
	 */
	if ('success' in this.callback) {
		this.callback._success = this.callback.success;
	}
	if ('error' in this.callback) {
		this.callback._error = this.callback.error;
	}
	this.callback.success = this._success;
	this.callback.error = this._error;

}

/**
 *  Inheritance from Cbinary_file
 */
Cfile_GBR.prototype = Object.create(Cbinary_file.prototype);

Cfile_GBR.prototype.constructor = new Cbinary_file();

/*
 * Initialize our data
 */
Cfile_GBR.prototype.init = function(response) {
	this.loaded = false;
	/**
	 * We are creating our magic number from scratch :)
	 */
	this.magic_number = ('G'.charCodeAt(0) << 24) + ('I'.charCodeAt(0) << 16)
			+ ('M'.charCodeAt(0) << 8) + 'P'.charCodeAt(0);
	this.cCanvas = null;
	/**
	 * Header fields
	 */
	this.headers = [
	    			{
	    				type : 'uint32',
	    				label : 'header_size'
	    			}, {
	    				type : 'uint32',
	    				label : 'version'
	    			}, {
	    				type : 'uint32',
	    				label : 'width'
	    			}, {
	    				type : 'uint32',
	    				label : 'height'
	    			}, {
	    				type : 'uint32',
	    				label : 'bytes'
	    			}, {
	    				type : 'uint32',
	    				label : 'magic_number'
	    			}, {
	    				type : 'uint32',
	    				label : 'spacing'
	    			}
	    	];
	/**
	 * Header index 
	 */
	this.FH = {
			header_size : 0,
			version : 1,
			width : 2,
			height : 3,
			bytes : 4,
			magic_number : 5,
			spacing : 6
		};
};
/**
 * That's the callback called by the xhr request
 * @param response
 * @returns {Boolean}
 */
Cfile_GBR.prototype._success = function(response) {
	this.loaded = false;
	if (this.parse_response(response)) {
		this.loaded = true;
		if ('_success' in this.callback) { // our original callback
			this.callback._success.call(this, response);
		}
		return true;
	}
	this.init();
	return false;
};

/**
 * We are parsing data retrieved with xhr
 * @param response Response from the xhr request
 * @returns {Boolean} Return true on success
 */
Cfile_GBR.prototype.parse_response = function(response) {
	var FH = this.FH;
	if (window.graphit.debug > 10) console.log('[File/GBR] Parsing header', this.src);
	/* A view on our byte array */
	var view = new DataView(response.response, 0);
	/* Position in byte array */
	var position = 0;
	/* 
	 * Reading header 
	 */
	for ( var offset = 0; offset < this.headers.length; offset++) {
		this.headers[offset].value = view.getInt32(position);
		if (window.graphit.debug > 10) console.log(this.headers[offset].label, this.headers[offset].value);
		position += 4; // We are reading 32bits
	}
	/*
	 * Checking magic number
	 */
	if (this.headers[FH.magic_number].value != this.magic_number) {
		console.error('Trying to load file that is not a GIMP GBR (Brush)');
		return false;
	}
	/* 
	 * Reading brush name
	 */
	var size = this.headers[FH.header_size].value;
	//console.log('name size', size);
	var name = '';
	for ( var i = 0; i < size; i++) {
		name += String.fromCharCode(view.getInt8(position));
		position += 1; // We are reading 8 bits
	}
	this.name = name;
	/**
	 * Reading image data
	 */
	/*
	 *  We are setting our canvas storing function based on brush format
	 *  4: rgbae
	 *  1: grayscale
	 */
	var func = null;
	var bformat = this.headers[FH.bytes].value;
	if (bformat == 4) {
		label_type = 'RGBA';
		func = this._canvas_store_rgba;
	} else if (bformat == 1) {
		label_type = 'GRAYSCALE';
		func = this._canvas_store_grayscale;
	} else {
		console.log('Dunnot know how parsing format with bytes => ', bformat);
		return false;
	}
	/* 
	 * Creating our canvas to copy file image into it  
	 */
	var canvas = new Ccanvas({
		width : this.headers[FH.width].value,
		height : this.headers[FH.height].value
	});
	/*
	 * Clearing canvas with transparent black 
	 * #TODO It's not transparent black ...
	 */
	canvas.clear(new Ccolor({a:1}));
	/*
	 * Acquiring context and image data
	 */
	var ctx = canvas.getContext('2d');
	var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var idx = 0;
	/* 
	 * We are calling our functions against each bytes in our source data
	 */
	for (; position < view.byteLength; position++) {
		idx += func(data, view, idx, position);
	}
	/*
	 * We are storing our pixel data into the canvas
	 */
	ctx.putImageData(data, 0, 0);
	this.cCanvas = canvas;
	return true;
};

Cfile_GBR.prototype._canvas_store_rgba = function(dataImage, bufferView,
		dataIndex, bufferIndex) {
	dataImage.data[dataIndex] = bufferView.getUint8(bufferIndex);
	return 1;
};

Cfile_GBR.prototype._canvas_store_grayscale = function(dataImage, bufferView,
		dataIndex, bufferIndex) {
	dataImage.data[dataIndex] = bufferView.getUint8(bufferIndex);
	dataImage.data[dataIndex + 1] = bufferView.getUint8(bufferIndex);
	dataImage.data[dataIndex + 2] = bufferView.getUint8(bufferIndex);
	dataImage.data[dataIndex + 3] = 255;
	return 4;
};

Cfile_GBR.prototype.dom_build = function() {
	var r = $('<div />');
	if( this.loaded) {
		r.append(this.cCanvas.dom_get());
	} else {
		r.append('<p>Failed to load Gimp gbr file: '+this.src+'</p>');
	}
	this.rootElm = r;
	return this;
};

Cfile_GBR.prototype._error = function() {
	this.init();
	if ('_error' in this.callback) {
		this.callback._error.call(this);
	}
};
