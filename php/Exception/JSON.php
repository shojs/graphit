<?php 
/**
 * 
 * Just a wrapper around normal PHP exception to display error as JSON
 * @author sho
 *
 */
class Exception_JSON extends Exception {
	
	/* Variables */
	const public_disclosure = true;
	private $ourmessage = null;
	private $label = nulll;
	private $data;
	
	/* Constructor */
	public function __construct($label, $msg, $data) {
		$this->ourmessage = $msg;
		$this->label = $label;
		$this->data = $data;
		parent::__construct($label . ' / ' . $msg);
	}

	public function write() {
		header('Cache-Control: no-cache, must-revalidate');
		header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
		header('Content-type: application/json');
		echo $this->to_json();
	}
	
	/* Convert our exception to a json string */
	public function to_json() {
		$exception = array(
			"label" => $this->label,
			"message" => $this->ourmessage,
			"data" => json_encode($this->data)
		);
		if (Exception_JSON::public_disclosure) {
			$exception["code"] = $this->code;
			$exception["file"] = $this->file;
			$exception["line"] = $this->line;
			$exception["original_message"] = $this->message;
		}
		$data = array("exception" => $exception);
		return json_encode($data);
	}
}
?>