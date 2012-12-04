<?php 


class Exception_JSON extends Exception {
	
	const public_disclosure = true;
	
	public function __construct($msg, $code = 0, $previous = null) {
		parent::__construct($msg, $code, $previous);
	}

	public function to_json() {
		$exception = array(
			"message" => $this->message,
		);
		if (Exception_JSON::public_disclosure) {
			$exception["code"] = $this->code;
			$exception["file"] = $this->file;
			$exception["line"] = $this->line;
		}
		$data = array("exception" => $exception);
		return json_encode($data);
	}
}


?>