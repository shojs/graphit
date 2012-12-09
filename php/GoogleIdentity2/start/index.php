<?php
$url = '/php/GoogleIdentity2/account_chooser/';
error_log('redirecting user: ' . $url);
header('Location: ' . $url);
exit(0);