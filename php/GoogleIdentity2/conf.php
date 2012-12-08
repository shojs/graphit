<?php
class GoogleIdentityConf {
    private static $data = array(
    	'developerKey' => 'AIzaSyBZ39Md7rznzZmePg0yX-YltS7vkvVH5mk',
    	'companyName' => 'YOUR_COMPANY_NAME',
    	'callbackUrl' => 'https://graphit.nosferat.us/php/GoogleIdentity2/callback/',
	);
   	function __construct() {
   		if (self::$data['developerKey'] == 'YOUR_GOOGLE_API_KEY') {
   			error_log('You must enter valid Google API key');
   			throw new Exception('invalid_google_api_key');
   		}
   	}

    public static function get($key) {
        if (isset(self::$data[$key])) {
            return self::$data[$key];
        }
        return null;
    }
	
    public static function toString() {
    	$str = "";
    	foreach(self::$data as $k => $v) {
    		$str .= "$k => $v\n";
    	}
    	return $str;
    }
}

new GoogleIdentityConf();
?>