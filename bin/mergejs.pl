#!/bin/perl

use strict;

use JavaScript::Minifier qw(minify);

my $path          = "../";
my $htm           = "index.htm";
my $fout          = "shojs-graphit-0.0.1-min.js";
my $COPT = "--compilation_level SIMPLE_OPTIMIZATIONS"; # ADVANCED_OPTIMIZATIONS
$COPT="";
my $bincomp = 'java -jar bin/google-compiler/closure-compiler.jar '.$COPT.' --js_output_file ' . $fout;
my $ls = '-' x 80 . "\n";

print $ls;
print " Merging javascript sources\n";
print $ls;

print " [chdir] $path \n";
chdir $path;
my $fh;
open( $fh, $htm )
  or die "Cannot open file $htm";
my $out = "";
my $bParse = 0;
my @jslist;
while (<$fh>) {
	!$bParse && ( $_ !~ /MINIFYJS:START/ ) && do { next; };
	$bParse = 1;
	( $_ =~ /MINIFYJS:STOP/ ) && do { $bParse = 0; next; };
	next unless $bParse;
	/^\s*<script\s*(.*)src="\s*(.*)\s*"\s*>\s*<\/script>\s*$/ and do {
		my $js = $2;
		$js =~ /^(deprecated).*/ and next;
		print " [Append] $js\n";
		$bincomp .= " --js $js";
	};
}
print $ls;
print "Executing js compiler\n";
$bincomp .= ' 2> bin/error.log <&1';
print $ls;
my $res =`$bincomp`;
print "[ Merged] into $fout:\n";
if ($res) {
	print "\tFailed\n";
} else {
	print "\tDone\n";
}
print $ls;
exit(0);