<?php
if (!defined('__ROOT__')) { define('__ROOT__', dirname(dirname(__FILE__))); }
require_once(__ROOT__.'/../Exception/JSON.php');
require_once(__ROOT__.'/Conf.php');

class EasyRpService {

  public static function getCurrentUrl() {
    $url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https://' : 'http://';
    $url .= $_SERVER['SERVER_NAME'];
    if ($_SERVER['SERVER_PORT'] != '80') {
      $url .= ':'. $_SERVER['SERVER_PORT'];
    }
    $url .= $_SERVER['REQUEST_URI'];
    return $url;
  }

  private static function getServerUrl() {
  	$url = 'https://www.googleapis.com/rpc?key=' . GoogleIdentity_Conf::get('developerKey');
  	error_log('url: ' . $url);
  	return $url;
  }
  
  private static function post($postData) {
    $ch = curl_init();
    curl_setopt_array($ch, array(
        CURLOPT_URL => self::getServerUrl(),
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
        CURLOPT_POSTFIELDS => json_encode($postData)));
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http_code != '200') {
    	#TODO: Handle exception
    	error_log("Error: $http_code $response");
    	throw new Exception_JSON('gitk_post_error');
    }
    error_log($response);
    if ($http_code == '200' && !empty($response)) {
      return json_decode($response, true);
    }
    return NULL;
  }

  public static function verify($continueUri, $response) {
    $request = array();
    $request['method'] = 'identitytoolkit.relyingparty.verifyAssertion';
    $request['apiVersion'] = 'v1';
    $request['params'] = array();
    $request['params']['requestUri'] = $continueUri;
    $request['params']['postBody'] = $response;
    $request['params']['returnOauthToken'] = True;
    $request['params']['client_id'] = '933111977942-ihta47n2lhn5qf55lu48dn27i5ruqsst.apps.googleusercontent.com';

    try {
    $result = EasyRpService::post($request);
    } catch (Exception $e) {
    	throw new Exception_JSON('erp_cannot_post_verify');
    }
    if (!empty($result['result'])) {
      return $result['result'];
    }
    return NULL;
  }
}