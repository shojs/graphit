<?php

class GoogleIdentity_Conf {
    private static $data = array(
    	'developerKey' => 'AIzaSyAzU4ihY1A_nRUkRl_64Mw6Xlk7FF_2pjM',
    	'companyName' => 'GraphIt (nosferat.us)',
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

// new GoogleIdentity_Conf();
?>
