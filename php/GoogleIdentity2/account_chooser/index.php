<?php 
    require_once('../GoogleIdentity.php');
 	$GI = new GoogleIdentity();
 	$conf = GoogleIdentity::$Conf;
   
?>
<!doctype html>
<html>
<head>
<?php echo $GI->echo_js_libs('../../../'); ?>

<script type="text/javascript">
  google.load("identitytoolkit", "2", {packages: ["ac",]});
 <?php if (0 &&$GI->getEmail()): ?>
 jQuery(function() {
     var homeUrl = '/php/GoogleIdentity2/start/'; // Your home page URL.
     var account = {
       email: '<?php echo $GI->getEmail(); ?>',  // required
       displayName: '<?php echo $GI->getDisplayName(); ?>',  // optional
       photoUrl: '<?php echo $GI->getPhotoUrl();?>'  // optional
     };
     // Store the account then return to homeUrl.
     window.google.identitytoolkit.storeAccount(account, homeUrl);
 });
 <?php endif;?>
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

 });
 </script>

</head>
<body>

</script>
</body>
</html>