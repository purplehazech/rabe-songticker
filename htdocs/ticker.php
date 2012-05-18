<?php
// quick n dirty proxy

header('Content-Type: application/xml');
echo file_get_contents("http://intranet.rabe.ch/songticker/0.9.3/current.xml");
