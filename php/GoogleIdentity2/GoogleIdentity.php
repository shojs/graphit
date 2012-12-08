<?php
require_once('conf.php');
require_once('EasyRpService.php');

class GoogleIdentity {
	/* Result from our IDP */
	private static $result = null;
	/* Faking authentification, always returning email */
	const FAKE_AUTH = false;
	/* We are storing configuration here */
	public static $Conf = null;
	/* parameter from idp */
	public $target = null;
	public $purpose = null;

	function __construct() {
		if (isset($_REQUEST['rp_target']))
			$this->set_target($_REQUEST['rp_target']);
		if (isset($_REQUEST['rp_purpose']))
			$this->set_purpose($_REQUEST['rp_purpose']);
		GoogleIdentity::$Conf = new GoogleIdentityConf();
		$this->start_session();
	}

	public function set_target($p_target) {
		error_log('p_target ' . $p_target);
		$pat = '/^(callback)$/';
		if (!preg_match($pat, $p_target)) {
			throw new Exception('gitk_invalid_target');
		}
		$this->target = $p_target;
	}

	public function set_purpose($p_purpose) {
		error_log('p_purpose ' . $p_purpose);
		$pat = '/^(signin)$/';
		if (!preg_match($pat, $p_purpose)) {
			throw new Exception('gitk_invalid_target');
		}
		$this->target = $p_purpose;
	}
	public static function getEmail() {
		$label = 'verifiedEmail';
		if (GoogleIdentity::FAKE_AUTH) {
			error_log(
					'WARNING? FAKE AUTHORISATION RETURNING EMAIL WITHOUT CHECK');
			return 'test@test.test';
		}
		if (isset($_SESSION[$label]) && $_SESSION[$label]) {
			return $_SESSION[$label];
		}
		return null;
	}

	public static function getDisplayName() {
		$label = 'displayName';
		if (isset($_SESSION[$label]) && $_SESSION[$label]) {
			return $_SESSION[$label];
		}
		return null;
	}

	public static function getLegacy() {
		$label = 'legacy';
		if (isset($_SESSION[$label]) && $_SESSION[$label]) {
			return $_SESSION[$label];
		}
		return null;
	}

	public static function getContext() {
		$label = 'context';
		if (isset($_SESSION[$label]) && $_SESSION[$label]) {
			return json_decode($_SESSION[$label], true);
		}
		return null;
	}

	public static function getPhotoUrl() {
		$label = 'photoUrl';
		if (isset($_SESSION[$label]) && $_SESSION[$label]) {
			return $_SESSION[$label];
		}
		return null;
	}

	public static function start_session() {
		error_log('----- ----- -----');
		error_log("Starting session");
		//GoogleIdentity::$conf = new GoogleIdentityConf();
		$url = EasyRpService::getCurrentUrl();
		$postData = @file_get_contents('php://input');
		$result = EasyRpService::verify($url, $postData);
		self::$result = $result;
		session_start();
		if (self::$result) {
			foreach (self::$result as $key => $value) {
				error_log('Set ' . $key . ' => ' . $value);
				$_SESSION[$key] = $value;
			}
		}
	}

	public static function destroy_session() {
		$_SESSION = array();
		if (ini_get("session.use_cookies")) {
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000, $params["path"],
					$params["domain"], $params["secure"], $params["httponly"]);
		}
		session_destroy();
		header('Location: index.php');
	}
	
	private function _js_one_script($path) {
		$nl = "\n";
		return '<script type="text/javascript" src="'.$path.'"></script>' . $nl;
	}
	public function echo_js_libs($base) {
		$str = '';
		$data = array(
			'//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js',
			'//ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js',
			'//ajax.googleapis.com/ajax/libs/googleapis/0.0.4/googleapis.min.js',
			'//ajax.googleapis.com/jsapi',
			'https://www.accountchooser.com/client.js',
			$base .'js/lib/fix.js',
			$base .'js/app/global.js',
			$base . 'js/lib/func.js',
			$base . 'js/lib/Cuid.js',
			$base . 'js/lib/Cexception.js',
			$base . 'js/lib/Cobject.js',
			$base . '../../js/app/CgraphitAuth.js'
		);
		for($i = 0; $i < count($data); $i++) {
			$str .= $this->_js_one_script($data[$i]);
		}
		return $str;
	}
}

?>