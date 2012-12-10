<?php
require_once(__ROOT__.'/GoogleIdentity2/EasyRpService.php');
require_once(__ROOT__.'/GoogleIdentity2/Message.php');
require_once(__ROOT__.'/GoogleIdentity2/Conf.php');

class GoogleIdentity {
	const DEBUG = 1;
	/* Result from our IDP */
	/* Faking authentification, always returning email */
	const FAKE_AUTH = false;
	/* We are storing configuration here */
	public static $Conf = null;
	/* parameter from idp */
	private $IDPDATA = null;
	
	private static $valid_session_keys = array('displayName', 'verifiedEmail', 'photoUrl');

	function __construct() {
		GoogleIdentity::$Conf = new GoogleIdentity_Conf();
		$this->session_start();
		if ($this->get('verifiedEmail')) {
			error_log('Logged user: ' . $this->get('verifiedEmail'));
		}
	}
	
	public function get($key) {
		if (isset(GoogleIdentity::$valid_session_keys[$key])) {
			throw new Exception_JSON('invalid_key', $key);
		}
		if (!$this->IDPDATA) {
			return null;
		}
		if (!isset($this->IDPDATA[$key])) {
			return null;
		}
		return $this->IDPDATA[$key]; 
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
		if ($result) {
			$this->session_set_data($result);
			return $result;
		} else {
			error_log('askGITK doesn\'t return response');
			return null;
		}
	}

	/*
	 * We are storing user data in php session
	 * 
	 */
	public function session_set_data($result) {
		if (!$result) { return False;} 
		$_SESSION['IDPDATA'] = json_encode($result);
		$this->decode_session_data();
		return True;
	}
	
	public function decode_session_data() {
		if (!isset($_SESSION['IDPDATA'])) { 
			$this->IDPDATA = null;
			return False;
		}
		$this->IDPDATA = json_decode($_SESSION['IDPDATA'], True);
		return True;
	}

	public function session_start() {
		session_name('GraphItSess');
		session_start();
		$this->decode_session_data();
		return true;
	}

	public function session_destroy() {
		$this->IDPDATA = null;
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
