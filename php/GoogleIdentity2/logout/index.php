<?php
if (!defined('__ROOT__')) { define('__ROOT__', dirname(dirname(__FILE__))); }
require_once(__ROOT__ . '/GoogleIdentity.php');

$GI = new GoogleIdentity();
$GI->session_destroy();
$message = new GoogleIdentity_Message('logout', 'logout successfull', 1);
echo $message->to_json();
exit(0);
?>