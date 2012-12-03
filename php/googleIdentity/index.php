<?php

function mlog() {
	$str = '';
	for ($i = 0; $i < func_num_args(); $i++) {
		$str .= func_get_arg($i) . ' ';
	}
	$str .= "\n";
	error_log($str);
}
require_once('../lib/GoogleIdentity.php');
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
<script type="text/javascript" src="//www.accountchooser.com/client.js"></script>
<script type="text/javascript" src="/js/app/CgraphitAuth.js"></script>
<script type="text/javascript">
google.load("identitytoolkit", "1.1", {
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
		tryFederatedFirst: true,
		useContextParam: true,
		useCachedUserStatus: true
	});
	$('#navbar').css('pointer-events', 'auto');
	$('#navbar').accountChooser({
		acMenu:true});
   var conf = null;
   if (parent in window && cGraphitAuth in window.parent) {
     conf = window.parent.cGraphitAuth;
   } else {
     console.error('Cannot communicate wiht parent frame');
     conf = new CgraphitAuth();
   }
	<?php
	if ($GI->getEmail()) {
		foreach ($_SESSION as $key => $value) {
			echo 'conf.set(\'' . $key . '\', \'' . $value . '\');' . "\n";
		}
	}
	?>
	//conf.each(function(k,v) { console.log('conf', k, v, conf.get(k)); });
  var userData = {};
 <?php if ($GI->getEmail()) : ?>
 userData = {
      email: conf.get('verifiedEmail'),
      displayName: conf.get('displayName'),
      legacy: conf.get('legacy'),
      photoUrl: conf.get('photoUrl')
  };
  console.log(userData);
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
  	 		google.load("identitytoolkit", "1.1", { packages: ["notify"] } );
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
	 		google.load("identitytoolkit", "1.1", { packages: ["notify"] } );
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