<?php
require_once('../GoogleIdentity.php');
$GI = new GoogleIdentity();
$conf = GoogleIdentity::$Conf;
$inEmail = null;
$outEmail = null;
if (isset($_REQUEST['email'])) {
	$inEmail = rawurldecode($_REQUEST['email']);
	error_log('inEmail: ' . $inEmail);
}
$pat = '/^([\w\d+._-]+@[\w\d+._-]+)$/';
$msg = null;
if (!$inEmail || !preg_match($pat, $inEmail, $match) || ($match[1] != $GI->getEmail())) {
	$msg = new GoogleIdentityMessage('is_logged', 'user is not logged', 0, array( email => $inEmail));
	echo $msg->to_json();
	exit(1);
}
$outEmail = $match[0];
error_log('Out: ' . $outEmail);
$msg = new GoogleIdentityMessage('is_logged', 'user is logged', 1, array( email => $GI->getEmail()));
echo $msg->to_json();
exit(0);
?>