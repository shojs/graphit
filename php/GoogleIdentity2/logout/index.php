<?php
require_once('../../include.php');
require_once(__ROOT__ . '/GoogleIdentity2/GoogleIdentity.php');

$GI = new GoogleIdentity();
if ($GI->get('verifiedEmail')) {
	error_log('Logout user: ' . $GI->get('verifiedEmail'));
}
$GI->session_destroy();
$message = new GoogleIdentity_Message('logout', 'logout successfull', 1);
echo $message->to_json();
exit(0);
?>