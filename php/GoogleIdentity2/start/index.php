<?php
require_once('../GoogleIdentity.php');

//header("Access-Control-Allow-Credentials", "true");

$GI = new GoogleIdentity();
$GI->start_session();
if ($GI->getEmail()) {
	$url = '/php/GoogleIdentity2/account_chooser/';
	error_log('redirectint user: ' . $url);
	header('Location: ' . $url);
	exit(0);
}
$state = $GI->target || 'start';
$context = null;
$target = null;
$email = $GI->getEmail();
$conf = GoogleIdentity::$Conf;
?>
<!doctype html>
<html>
<head>
<?php 
	/* We are injecting our js library */
	echo $GI->echo_js_libs('../../../'); 
?>
<script type="text/javascript">
google.load("identitytoolkit", "2", {
 packages: ["ac"],
 language:"en"
});
</script>
<script type="text/javascript">
$(function() {
 window.google.identitytoolkit.setConfig({
  developerKey: "<?php echo $conf->get('developerKey'); ?>",
  companyName: "<?php echo $conf->get('companyName'); ?>",
  callbackUrl: "<?php echo $conf->get('callbackUrl'); ?>",
  realm: "",
  userStatusUrl: "",
  loginUrl: "login.php",
  signupUrl: "",
  homeUrl: "",
  logoutUrl: "logout.php",
  idps: ["Gmail", "Yahoo"],
        idpConfig: {
          //scopes: ['https://www.googleapis.com/auth/drive']
        },
  tryFederatedFirst: true,
  //useContextParam: true,
  useCachedUserStatus: true,
 });
 console.log('init google toolkit');
   window.google.identitytoolkit.init();
   var conf = window.cGraphit.auth;
<?php
	/* Feed our Javascript Object */
	if ($GI->getEmail()) {
		error_log('feed our pet');
		foreach ($_SESSION as $key => $value) {
			echo 'conf.set("' . $key . '", "' . $value . '");' . "\n";
		}
	}
?>
  var userData = {};
<?php if ($email) : ?>
 userData = {
      email: conf.get("verifiedEmail"),
      displayName: conf.get("displayName"),
      legacy: conf.get("legacy"),
      photoUrl: conf.get("photoUrl")
  };
<?php endif; ?>
 console.log('userData',userData);
  // #TODO: DANGEROUS *
  //window.parent.postMessage(userData, '*');

  window.google.identitytoolkit.updateSavedAccount(userData);
  //console.log(window.google.identitytoolkit);
  //window.google.identitytoolkit.showSavedAccount(userData.email);
  if (conf.is_logged()) {
   console.log('LOGGED', window);//window.google.identitytoolkit.showSavedAccount(userData.email);
  }
});
</script>
</head>
<body style="margin: 0; padding:0">
</body >
</html>