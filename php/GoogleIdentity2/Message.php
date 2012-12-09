<?php 
Class GoogleIdentity_Message {
 private $msg = null;
 private $action = null;
 private $code = null;
 private $data = null;

 function __construct($action, $msg, $code = 0, $data = NULL) {
  $this->msg = $msg;
  $this->action = $action;
  $this->code = $code;
  $this->data = $data;
  return $this;
 }
 
 public function write() {
 	header('Cache-Control: no-cache, must-revalidate');
 	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
 	header('Content-type: application/json');
 	echo $this->to_json();
 }
 
 public function to_json() {
  return json_encode(
    array(msg => $this->msg, action => $this->action,
      code => $this->code, data => $this->data));
  return $this;
 }
}