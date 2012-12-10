<?php
require_once('../../include.php');
require_once(__ROOT__.'GoogleIdentity2/GoogleIdentity.php');

$GI = new GoogleIdentity();

$GI->askGITK();
$conf = GoogleIdentity::$Conf;

?>
<!doctype html>
<html>
<head>
<?php echo $GI->echo_js_libs('../../../'); ?>
<script type='text/javascript'>
  google.load("identitytoolkit", "2", {
    packages: [ "ac"],
    language: "en"
  });
</script>
<script>
$(function() {
 window.google.identitytoolkit.setConfig({
    developerKey: "<?php echo $conf->get('developerKey'); ?>",
    companyName: "<?php echo $conf->get('companyName'); ?>",
    callbackUrl: "<?php echo $conf->get('callbackUrl'); ?>",
    realm: "",
    userStatusUrl: "php/GoogleIdentity2/userStatusUrl/",
    loginUrl: "php/GoogleIdentity2/login/",
    signupUrl:"php/GoogleIdentity2/signup/",
    homeUrl:  "php/GoogleIdentity2/start/",
    logoutUrl: "php/GoogleIdentity2/logout/",
    idps: ["Gmail", "Yahoo"],
    idpConfig: {
        Gmail: {
          scopes: [
            "https://www.googleapis.com/auth/plus.me"
                   ],
        }
      },
    tryFederatedFirst: true,
    language: 'en',
    useContextParam: true,
    useCachedUserStatus: true,
   });
});
  var conf = window.graphit.auth;
  <?php
/* Feed our Javascript Object */
if ($GI->get('verifiedEmail')) {
	echo $GI->js_fill_conf();
}
  ?>
  var userData = {};
  <?php if ($GI->get('verifiedEmail')) : ?>
   userData = {
        email: conf.get("verifiedEmail"),
        displayName: conf.get("displayName"),
        photoUrl: conf.get("photoUrl")
    };
  <?php endif; ?>
  var o = window.opener;
  if (o) {
  o.google.identitytoolkit.updateSavedAccount(userData);
  console.log('userData', userData);
  o.graphit.auth.send_trigger('update');
  //window.close();
  }
  </script>
</head>
<script
</script>
<body>
</body>
</html>
