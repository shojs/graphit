<?php
require_once('GoogleIdentity.php');
require_once('conf.php');

$state = isset($_GET['state']) ? $_GET['state'] : 'start';
$GICONF = new GoogleIdentityConf();
$GI = new GoogleIdentity();

$GI->start_session();

$context = null;
$target = null;
$email = $GI->getEmail();
if ($context = $GI->getContext()) {
	$target = $context['rp_target'];
}
if ($state != 'callback' && $GI->getEmail()) {
	$state = 'logged';
}
?>
 <?php if ($state == 'start' || $state == 'logged') : ?>
<html>
<head>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js"></script>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/googleapis/0.0.4/googleapis.min.js"></script>
<script type="text/javascript" src="//ajax.googleapis.com/jsapi"></script>
<script type="text/javascript" src="https://www.accountchooser.com/client.js"></script>
<script type="text/javascript" src="/js/app/CgraphitAuth.js"></script>
<script type="text/javascript">
google.load("identitytoolkit", "2", {
	packages: ["ac"],
	language:"en"
});
</script>
<script type="text/javascript">
$(function() {
	window.google.identitytoolkit.setConfig({
		developerKey: "<?php echo $GICONF->get('developerKey'); ?>",
		companyName: "<?php echo $GICONF->get('companyName'); ?>",
		callbackUrl: "<?php echo $GICONF->get('callbackUrl'); ?>",
		realm: "",
		userStatusUrl: "",
		loginUrl: "/php/GoogleIdentity2/login.php",
		signupUrl: "",
		homeUrl: "",
		logoutUrl: "logout.php",
		idps: ["Gmail", "Yahoo"],
        idpConfig: {
          //scopes: ['https://www.googleapis.com/auth/drive']
        },
		tryFederatedFirst: true,
		useContextParam: true,
		useCachedUserStatus: true,
	});
	$('#navbar').accountChooser({
		acMenu:true});
	 window.google.identitytoolkit.init();
   var conf = null;
   if (window.parent && "cGraphitAuth" in window.parent) {
     conf = window.parent.cGraphitAuth;
     console.log("Com with parent ok");
   } else {
    console.log(window.parent);
     console.error('Cannot communicate wiht parent frame', window, window.parent);
     conf = new CgraphitAuth();
   }
	<?php
	/* Feed our Javascript Object */
	if ($GI->getEmail()) {
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
  console.log(userData);
  // #TODO: DANGEROUS *
  //window.parent.postMessage(userData, '*');

  window.google.identitytoolkit.updateSavedAccount(userData);
  window.google.identitytoolkit.showSavedAccount(userData.email);
<?php endif; ?>
});
</script>
</head>
<body style="margin: 0; padding:0">
 <div id='navbar' ></div>
</body >
</html>
<?php elseif ($state == 'callback') : ?>
<?php
	$email = $GI->getEmail();
	if (!$email) {
		$GI->destroy_session();
		echo <<<END
  	 	<html>
  	 	<head>
  	 	<script type='text/javascript' src='https://ajax.googleapis.com/jsapi'></script>
  	 	<script type='text/javascript'>
  	 		google.load("identitytoolkit", "2", { packages: ["notify"] } );
  	 	</script>
  	 	</head>
  	 	<body>
  	 	<script type='text/javascript'>
  	 		window.google.identitytoolkit.notifyFederatedError();
  	 		window.parent.cGraphitAuth.reset();
  	 	</script>
  	 	</body>
  	 	</html>
END;
	} else {
		$email = $result['verifiedEmail'];
		$displayName = $result['displayName'];
		echo <<<END
	 	<html>
	 	<head>
	 	<script type='text/javascript' src='https://ajax.googleapis.com/jsapi'></script>
	 	<script type='text/javascript'>
	 		google.load("identitytoolkit", "2", { packages: ["notify"] } );
	 	</script>
	 	</head>
	 	<body>
	 	<script type='text/javascript'>
	 		window.google.identitytoolkit.notifyFederatedSuccess({
	 			"email": "$email", 
	 			"displayName": "$displayName",
	 			"registered": true 
	  		});
	 	</script>
	 	</body>
	 	</html>
END;
	}
?>
<?php endif; ?>