<?php
define('__ROOT__', dirname(dirname(__FILE__)));
require_once(__ROOT__.'/EasyRpService.php');
require_once(__ROOT__.'/Message.php');
require_once(__ROOT__.'/Conf.php');

class GoogleIdentity {
	const DEBUG = 1;
	/* Result from our IDP */
	/* Faking authentification, always returning email */
	const FAKE_AUTH = false;
	/* We are storing configuration here */
	public static $Conf = null;
	/* parameter from idp */
	public $target = null;
	public $purpose = null;
	private static $valid_session_keys = array('displayName', 'verifiedEmail', 'photoUrl');

	function __construct() {
		if (isset($_REQUEST['rp_target'])) // NOT SET WHEN USING useContextParam: true, ???
			$this->set_target($_REQUEST['rp_target']);
		if (isset($_REQUEST['rp_purpose']))
			$this->set_purpose($_REQUEST['rp_purpose']);
		GoogleIdentity::$Conf = new GoogleIdentity_Conf();
		$this->session_start();
	}
	
	public function get($key) {
		if (isset(GoogleIdentity::$valid_session_keys[$key])) {
			throw new Exception_JSON('invalid_key', $key);
		}
		if (!isset($_SESSION[$key])) {
			return null;
		}
		return $_SESSION[$key]; 
	}



	/*
	 *  We are asking GITK for user data on IDP callback
	 *  @return {Array} Resulting array
	 */
	public function askGITK() {
		$url = EasyRpService::getCurrentUrl();
		$postData = @file_get_contents('php://input');
		$result = null;
		$result = EasyRpService::verify($url, $postData);
		return $result;
	}

	/*
	 * We are storing user data in php session
	 * 
	 */
	public function session_set_data($result) {
		foreach ($result as $key => $value) {
			if (GoogleIdentity::DEBUG)
				error_log("session_set " . $key . " => " . $value);
			$_SESSION[$key] = $value;
		}
	}

	public static function session_start() {
		session_start();
		return true;
	}

	public static function session_destroy() {
		$_SESSION = array();
		if (ini_get("session.use_cookies")) {
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000, $params["path"],
					$params["domain"], $params["secure"], $params["httponly"]);
		}
		session_unset();
		session_destroy();
	}

	private function _js_one_script($path) {
		$nl = "\n";
		return '<script type="text/javascript" src="' . $path . '"></script>'
				. $nl;
	}
	public function echo_js_libs($base) {
		$str = '';
		$data = array(
				'https://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js',
				'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js',
				'https://ajax.googleapis.com/ajax/libs/googleapis/0.0.4/googleapis.min.js',
				'https://ajax.googleapis.com/jsapi',
				//'https://www.accountchooser.com/client.js',
				$base . 'js/lib/fix.js', $base . 'js/app/global.js',
				$base . 'js/lib/func.js', $base . 'js/lib/Cuid.js',
				$base . 'js/lib/Cexception.js', $base . 'js/lib/Cobject.js',
				$base . '../../js/app/CgraphitAuth.js');
		for ($i = 0; $i < count($data); $i++) {
			$str .= $this->_js_one_script($data[$i]);
		}
		return $str;
	}
	
	public function js_fill_conf() {
		$str = '';
		$nl = "\n";
		foreach (GoogleIdentity::$valid_session_keys as $k) {
			if ($k == 'context') {
				$str .= 'conf.set("' . $k . '","' . json_decode($this->get($k)) . '");'
						. $nl;
			} else {
				$str .= 'conf.set("' . $k . '","' . $this->get($k) . '");' . $nl;
			}
		}
		return $str;
	}

	public function to_json() {
		$data;
		foreach ($this->auth_conf_keys as $k) {
			$data[$k] = $_SESSION[$k];
		}
		return json_encode($data);
	}
}

?>
