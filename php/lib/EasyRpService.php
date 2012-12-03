<?php
require_once('../googleIdentity/conf.php');

class EasyRpService {
	
  private static $SERVER_URL = 'https://www.googleapis.com/rpc?key=AIzaSyBZ39Md7rznzZmePg0yX-YltS7vkvVH5mk';

  public static function getCurrentUrl() {
    $url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https://' : 'http://';
    $url .= $_SERVER['SERVER_NAME'];
    if ($_SERVER['SERVER_PORT'] != '80') {
      $url .= ':'. $_SERVER['SERVER_PORT'];
    }
    $url .= $_SERVER['REQUEST_URI'];
    return $url;
  }

  private static function post($postData) {
    $ch = curl_init();
    curl_setopt_array($ch, array(
        CURLOPT_URL => EasyRpService::$SERVER_URL,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
        CURLOPT_POSTFIELDS => json_encode($postData)));
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http_code == '200' && !empty($response)) {
      error_log('We got rp response');
      return json_decode($response, true);
    }
    error_log('post returning null ' . $response);
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

    $result = EasyRpService::post($request);
    if (!empty($result['result'])) {
      return $result['result'];
    }
    return NULL;
  }
}