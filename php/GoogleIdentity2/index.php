<?php
require_once('GoogleIdentity.php');
//require_once('conf.php');

//$GICONF = new GoogleIdentityConf();
$GI = new GoogleIdentity();
$GI->start_session();
$GICONF = GoogleIdentity::$conf;
$state = $GI->target || 'start';
$context = null;
$target = null;
$email = $GI->getEmail();

if ( $GI->getEmail()) {
	$state = 'logged';
}
error_log('STATE ' . $state);
?>

 <?php if ($state == 'start' || $state == 'logged') : ?>
<html>
<head>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js"></script>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/googleapis/0.0.4/googleapis.min.js"></script>
<script type="text/javascript" src="//ajax.googleapis.com/jsapi"></script>
<script type="text/javascript" src="https://www.accountchooser.com/client.js"></script>
<script type="text/javascript" src="../../js/lib/fix.js"></script>
<script type="text/javascript" src="../../js/app/global.js"></script>
<script type="text/javascript" src="../../js/lib/func.js"></script>
<script type="text/javascript" src="../../js/lib/Cuid.js"></script>
<script type="text/javascript" src="../../js/lib/Cexception.js"></script>
<script type="text/javascript" src="../../js/lib/Cobject.js"></script>
<script type="text/javascript" src="../../js/app/CgraphitAuth.js"></script>
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
	//$('#navbar').accountChooser({
		//acMenu:true});
<?php if ($state == 'start'): ?>
 console.log('init google toolkit');
   window.google.identitytoolkit.init();
<?php endif; ?>
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
 <?php if ($GI->getEmail()) : ?>
 userData = {
      email: conf.get("verifiedEmail"),
      displayName: conf.get("displayName"),
      legacy: conf.get("legacy"),
      photoUrl: conf.get("photoUrl")
  };
  console.log('userData',userData);
  // #TODO: DANGEROUS *
  //window.parent.postMessage(userData, '*');

  window.google.identitytoolkit.updateSavedAccount(userData);
  console.log(window.google.identitytoolkit);
  window.google.identitytoolkit.showSavedAccount(userData.email);
  conf.send_trigger('identity_set', userData);
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
  	 	console.log('notify....');
  	 		window.google.identitytoolkit.notifyFederatedError();
  	 		window.parent.cGraphitAuth.reset();
  	 	</script>
  	 	</body>
  	 	</html>
END;
	} else {
		$email = $result['verifiedEmail'];
		$displayName = $result['displayName'];
		error_log('plop');
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