<?php
define('__ROOT__', dirname(dirname(__FILE__)));
require_once(__ROOT__.'/GoogleIdentity.php');
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
if (!$inEmail || !preg_match($pat, $inEmail, $match) || ($match[1] != $GI->get('verifiedEmail'))) {
	$msg = new GoogleIdentity_Message('is_logged', 'user is not logged', 0, array( email => $inEmail));
	echo $msg->to_json();
	exit(1);
}
$outEmail = $match[0];
error_log('Out: ' . $outEmail);
$msg = new GoogleIdentity_Message('is_logged', 'user is logged', 1, array( email => $GI->get('verifiedEmail')));
echo $msg->to_json();
exit(0);
?>