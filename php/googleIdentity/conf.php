<?php
class GoogleIdentityConf {
    private static $data = [
    	'developerKey' => 'YOUR_GOOGLE_API_KEY',
    	'companyName' => 'YOUR_COMPANY_NAME',
    	'callbackUrl' => 'YOUR_CALLBACK_URL',
	];
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