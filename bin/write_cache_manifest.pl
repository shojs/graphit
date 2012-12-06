#!/usr/bin/perl -w

use strict;
use File::Find;

##########
# GLOBAL #
##########
my $nl = "\n";
my $manifest;

sub wm {
	my ($manifest, $str) = @_;
	$$manifest.= $str . $nl;
}
	
sub want_images {
	/^.*\.(png|jpg|jpeg|gif)$/i or return;
    wm(\$manifest, $File::Find::dir . '/' . $_);
}

sub want_css {
	/^.*\.(css)$/i or return;
    wm(\$manifest, $File::Find::dir . '/' . $_);
}

sub want_js {
    /^.*\.(js)$/i or return;
    wm(\$manifest, $File::Find::dir . '/' . $_);
}
########
# MAIN #
########
chdir '..';
wm(\$manifest, 'CACHE MANIFEST');
wm(\$manifest, "");
wm(\$manifest, 'CACHE:');
wm(\$manifest, 'NETWORK:');
find(\&want_images, qw|images js/plugin|);
find(\&want_css, qw|js/plugin|);
find(\&want_js, qw|js/plugin|);
wm(\$manifest, "");
#wm(\$manifest, 'NETWORK:');
find(\&want_js, qw|js/lib js/app|);
find(\&want_css, qw|css|);
print $manifest;