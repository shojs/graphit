<?php 

require_once('EasyRpService.php');

class GoogleIdentity {
	
	private static $result = null;

	function __construct() {
	}

	public static function getEmail() {
		$label = 'verifiedEmail';
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
		$url = EasyRpService::getCurrentUrl();
		$postData = @file_get_contents('php://input');
		self::$result = EasyRpService::verify($url, $postData);
		session_start();
		if (self::$result) {
			foreach (self::$result as $key => $value) {
				$_SESSION[$key] = $value;
			}
		}
	}
	
	public static function destroy_session() {
		$_SESSION = array();
		if (ini_get("session.use_cookies")) {
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000,
			$params["path"], $params["domain"],
			$params["secure"], $params["httponly"]
			);
		}
		session_destroy();
		header('Location: index.php');
	}
	
		
}



?>