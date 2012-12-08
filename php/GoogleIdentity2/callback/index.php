<?php
require_once('../GoogleIdentity.php');
$GI = new GoogleIdentity();
$conf = GoogleIdentity::$Conf;

?>
<!doctype html>
<html>
<head>
<?php echo $GI->echo_js_libs('../../../'); ?>
<script type='text/javascript' src='https://ajax.googleapis.com/jsapi'></script>
<script type='text/javascript'>
  google.load("identitytoolkit", "2", {
  packages: [ "ac"] } );
</script>
<script>
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
});
  var conf = window.graphit.auth;
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
  <?php if ($GI->getEmail()) : ?>
   userData = {
        email: conf.get("verifiedEmail"),
        displayName: conf.get("displayName"),
        legacy: conf.get("legacy"),
        photoUrl: conf.get("photoUrl")
    };
  <?php endif; ?>
  var o = window.opener;
  o.google.identitytoolkit.updateSavedAccount(userData);
  o.graphit.auth.copy(window.graphit.auth);
  o.graphit.core.send_trigger('display_widget', o.graphit.core.wLogin);
  window.close();
  </script>
</head>
<script
</script>
<body>
</body>
</html>
