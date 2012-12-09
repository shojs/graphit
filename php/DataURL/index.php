<?php
require_once('../Exception/JSON.php');
require_once('../GoogleIdentity2/GoogleIdentity.php');

$GICONF = new GoogleIdentityConf();
$GI = new GoogleIdentity();

header('Content-Type: application/json');

try {
	if (!$GI->get('verifiedEmail')) {
		$e = new Exception_JSON('user_not_authorized');
		throw $e;
	}
	if (!isset($_GET["url"])) {
		header('HTTP/1.0 400 No url specified');
		$e = new Exception_JSON('no_url_specified');
		throw $e;
	}
	// Check if the URL is set
	// 	if (!isset($_GET["url"])) {
	// 		header('HTTP/1.0 400 Bad Request');
	// 		$e = new Exception_JSON('no_callback_specified');
	// 		throw $e;
	// 	}
	//#TODO: Check that this get is secure ... 
	// Get the URL and decode to remove any %20, etc
	$url = urldecode($_GET["url"]);

	// Get the contents of the URL
	$file = file_get_contents($url);

	// Check if it is an image
	if (!@imagecreatefromstring($file)) {
		header('HTTP/1.0 400 Invalid image specified');
		$e = new Exception_JSON('invalid_image_specified');
		throw $e;
	}
	// Get the image information
	$size = getimagesize($url);
	// Image type
	$type = $size["mime"];
	// Dimensions
	$width = $size[0];
	$height = $size[1];

	// Setup the data URL
	$type_prefix = "data:" . $type . ";base64,";

	// Encode the image into base64
	$base64file = base64_encode($file);

	// Combine the prefix and the image
	$data_url = $type_prefix . $base64file;

	// Setup the return data
	$return_arr = array('width' => $width, 'height' => $height,
			'data' => $data_url);

	// Encode it into JSON
	$return_val = json_encode($return_arr);

	// If a callback has been specified
	if (isset($_GET["callback"])) {

		// Wrap the callback around the JSON
		$return_val = $_GET["callback"] . '(' . $return_val . ');';

		// Set the headers to JSON and so they wont cache or expire
		header('Cache-Control: no-cache, must-revalidate');
		header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
		header('Content-type: application/json');

		// Print the JSON
		print $return_val;

		// No callback was set
	} else {

	}

	// The requested file is not an image

	// No URL set so error

} catch (Exception $e) {
	if ($e instanceof Exception_JSON) {
		echo $e->to_json();
	} else {
		header('HTTP/1.0 500 Internal Server Error');
		echo "Internal Server Error";
	}
}

?>