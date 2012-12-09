<?php
define('__ROOT__', dirname(dirname(__FILE__)));
require_once(__ROOT__.'/GoogleIdentity.php');
###################
# Account Chooser #
###################

$GI = new GoogleIdentity();
$conf = GoogleIdentity::$Conf;

?>
<!doctype html>
<html>
<head>
<?php echo $GI->echo_js_libs('../../../'); ?>

<script type="text/javascript">
  google.load("identitytoolkit", "2", {packages: ["ac"], language: 'en'});
  <?php if (0 && $GI->get('verifiedEmail')) : ?>
   jQuery(function() {
     var homeUrl = '/php/GoogleIdentity2/start/'; // Your home page URL.
     var account = {
       email: '<?php echo $GI->get('verifiedEmail'); ?>',  // required
       displayName: '<?php echo $GI->get('displayName'); ?>',  // optional
       photoUrl: '<?php echo $GI->get('photoUrl'); ?>'  // optional
     };
     // Store the account then return to homeUrl.
     window.google.identitytoolkit.storeAccount(account, null);
     window.google.identitytoolkit.loadAccount(account);
 });
 <?php endif; ?>
 $(function() {
  window.google.identitytoolkit.setConfig({
   developerKey: "<?php echo $conf->get('developerKey'); ?>",
   companyName: "<?php echo $conf->get('companyName'); ?>",
   callbackUrl: "<?php echo $conf->get('callbackUrl'); ?>",
   realm: "",
   userStatusUrl: "php/GoogleIdentity2/userStatusUrl",
   loginUrl: "/php/GoogleIdentity2/login/",
   signupUrl: "/php/GoogleIdentity2/signupUrl/",
   homeUrl: "/php/GoogleIdentity2/start/",
   logoutUrl: "/php/GoogleIdentity2/logout/",
   idps: ["Gmail", "Yahoo"],
   idpConfig: {
     Gmail: {
       scopes: [
         "https://www.googleapis.com/auth/plus.me"
                ],
     }
   },
   tryFederatedFirst: true,
   language: "en",
   useContextParam: true,
   useCachedUserStatus: true,
  });
  console.log('init google toolkit');
    window.google.identitytoolkit.init();
    var conf = window.graphit.auth;
 <?php
/* Feed our Javascript Object */
if ($GI->get('verifiedEmail')) {
	echo $GI->js_fill_conf();
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
   window.google.identitytoolkit.updateSavedAccount(userData);
   //window.google.identitytoolkit.updateStore(userData);
 });
 </script>

</head>
<body>

</script>
</body>
</html>