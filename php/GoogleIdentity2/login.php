<?php 
    require_once('conf.php');
?>
<html>
<head>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js"></script>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/googleapis/0.0.4/googleapis.min.js"></script>
<script type="text/javascript" src="//ajax.googleapis.com/jsapi"></script>
<script type="text/javascript" src="//www.accountchooser.com/client.js"></script>
<script type="text/javascript">
  google.load("identitytoolkit", "2", {packages: ["ac"], language:"en"});
</script>
</head>
<body>
<script type="text/javascript">
  $(function() {
   console.warn('LOGIN');
    window.google.identitytoolkit.setConfig({
        developerKey: '<?php echo GoogleIdentityConf::get('developerKey'); ?>',
        companyName: '<?php echo GoogleIdentityConf::get('companyName'); ?>',
        callbackUrl: '<?php echo GoogleIdentityConf::get('callbackUrl'); ?>',
        realm: "",
        userStatusUrl: "",
        loginUrl: "login.php",
        signupUrl: "",
        homeUrl: "/?rp_target=home",
        logoutUrl: "logout.php",
        idps: ["Gmail", "Yahoo"],
        tryFederatedFirst: true,
        useContextParam: true,
        language: "en",
        useCachedUserStatus: false
    });
    window.google.identitytoolkit.init();
  });

</script>
</body>
</html>