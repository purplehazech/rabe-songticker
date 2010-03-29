<?php
/**
 * a small php/gdlib based server for creating ticker images
 *
 * the ticker image will be used for degrading on strange 
 * browsers this might also go in a noscript for the example 
 * code.
 */

class ImageServer_Station_RaBe {
	var $caller;
	function __construct($caller) {
		$this->caller = $caller;
	}
	var $url  = 'http://songticker.li/data/rabe.ch/0.9.1/';
	var $name = 'Radio RaBe 95.6 MHz';
}

class ImageServer_Output_Abstract {
	var $caller;
	var $output;
	var $image_type;
	function __construct($caller, $image_type, $options) {
		$this->caller     = $caller;
		$this->options    = $options;
		$this->image_type = $image_type;
		$this->init();
	}
	function init() {
		$this->image_handle = imagecreate(288, 72);
		imagealphablending($this->image_handle, false);
		imagesavealpha($this->image_handle, true);
		imageantialias($this->image_handle, true);
		$this->colors['black'] = imagecolorallocatealpha($this->image_handle,0,0,0,127);
		imagecolortransparent($this->image_handle,$this->colors['black']);
		$this->colors['white'] = imagecolorallocate($this->image_handle,255,255,255);
		//$this->colors['white'] = imagecolorallocatealpha($this->image_handle, 255, 255, 255, 127);
		foreach ($this->options['colors'] AS $name => $hex) {
			$a = sscanf($hex, '#%2x%2x%2x');
			$this->colors[$name] = imagecolorallocate($this->image_handle, $a[0], $a[1], $a[2]);
		}
		$this->imagefillroundedrect(1,1,286,71,6,$this->colors['border']);
		$this->imagefillroundedrect(2,2,285,69,6,$this->colors['background']);

		$bg_handle = imagecreatefromgif('img_server/bg_songticker.gif');
		imagecopy($this->image_handle, $bg_handle, 65, 17, 0, 0, imagesx($bg_handle), imagesy($bg_handle));

		$logo_handle = imagecreatefrompng('img_server/rabe_gruen.png');
		imagecopy($this->image_handle, $logo_handle, 4, 2, 0, 0, imagesx($logo_handle), imagesy($logo_handle));
		
		imagestring($this->image_handle, 2, 67, 2, $this->caller->station->name, $this->colors['foreground']);
		#imagettftext($this->image_handle, 12, 0, 67, 14, $this->colors['foreground'], 'img_server/Vera.ttf', $this->caller->station->name);
	}
	function imagefillroundedrect($x,$y,$cx,$cy,$rad,$col) {
		$im = $this->image_handle;
		// Draw the middle cross shape of the rectangle
		imagefilledrectangle($im,$x,$y+$rad,$cx,$cy-$rad,$col);
		imagefilledrectangle($im,$x+$rad,$y,$cx-$rad,$cy,$col);

		// Now fill in the rounded corners
		$dia = $rad*2;
		imagefilledellipse($im, $x+$rad, $y+$rad, $rad*2, $dia, $col);
		imagefilledellipse($im, $x+$rad, $cy-$rad, $rad*2, $dia, $col);
		imagefilledellipse($im, $cx-$rad, $cy-$rad, $rad*2, $dia, $col);
		imagefilledellipse($im, $cx-$rad, $y+$rad, $rad*2, $dia, $col);
	}
	function generate() {
		$imagetype_func = $this->image_type;
		$imagetarget = $this->options['target'];

		if ((string) $this->caller->simplexml->title != '') {
			$title = $this->caller->simplexml->title;
		} else if ((string) $this->caller->simplexml->message != '') {
			$title = $this->caller->simplexml->message;
		}
		if (!empty($this->caller->simplexml->artist)) {
			$artist = $this->caller->simplexml->artist;
		}
		
		imagestring($this->image_handle, 3, 70, 25, strtoupper(utf8_decode($title)), $this->colors['title']);
		imagestring($this->image_handle, 2, 70, 40, utf8_decode($artist), $this->colors['artist']);
		
		return $imagetype_func($this->image_handle, $imagetarget);
	}
}

class ImageServer_Output_Png extends ImageServer_Output_Abstract {
	function __construct($caller, $options) {
		parent::__construct($caller, 'imagepng', $options);
	}
}


class ImageServer {
	var $options;
	var $station;
	var $outputs;
	function __construct($options) {
		$this->options = &$options;
		switch ($options['station']) {
			case 'rabe.ch':
				$this->station = new ImageServer_Station_RaBe($this);
			break;
			default:
				throw new Exception('unknown station id');
		}
		foreach ($options['output'] AS $output) {
			switch($output['type']) {
				case 'png':
					$this->output[] = new ImageServer_Output_Png($this, $output);
				break;
				default:
					throw new Exception('unknown output type');
			}
		}
		$this->init();
	}
	function init() {
		$this->curl_handle = curl_init($this->station->url);
		curl_setopt($this->curl_handle, CURLOPT_USERAGENT, 'Songtickerli/1.0 (http://songticker.li)');
		curl_setopt($this->curl_handle, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($this->curl_handle, CURLOPT_HTTPHEADER, array("Pragma: "));
		$this->load_file();
		$this->update_all();
	}
	function load_file() {
		$this->current_xml = curl_exec($this->curl_handle);
		$this->simplexml = simplexml_load_string($this->current_xml);
	}
	function update_all() {
		foreach ($this->output AS $output) {
			$output->generate();
die;
		}
	}
	function run() {
		while(true) {
			sleep(10);
			$this->load_file();
			$http_code = curl_getinfo($this->curl_handle, CURLINFO_HTTP_CODE);
			switch ($http_code) {
				case '200':
					$this->update_all();
				break;
			}
			continue;
		}
	}
}

if (!defined('ImageServer_Main')) {
	define('ImageServer_Main', 'ImageServer');
}
$options = array(
	'station' => 'rabe.ch',
	'output' => array(
		array(
			'type'   => 'png',
			'target' => '/var/www/dev.songticker.li/htdocs/rabe_gruen.png',
			'colors' => array(
				'background' => '#1C2734',
				'foreground' => '#C4E218',
				'border'     => '#303030',
				'title'      => '#E7501E',
				'artist'     => '#505360'
			)
		)
	)
);
$server = new ImageServer($options);
$server->run();
