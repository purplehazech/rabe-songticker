<?php
/**
 * a very dirty proxy
 *
 * i will start changing this so it passes on
 * any proxy info coming from the browser or
 * elsewhere, for now at least this works for 
 * testing.
 * For rabe.ch this will not need apikey supprt
 * since rabe.ch has an allow rule on its ip.
 */

$res = file_get_contents("http://intranet.rabe.ch/songticker/0.9.3/test.php");
foreach ($http_response_header AS $header) {
    if (substr($header, 0, 5) == 'ETag:') {
        $etag = substr($header, 6);
    }
}


header('Content-Type: application/xml');
header('Etag: '.$etag);
echo $res;
