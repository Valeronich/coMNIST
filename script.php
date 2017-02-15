<?php
	// requires php5
	$cur_letter = $_POST['letter'];
	define('UPLOAD_DIR', 'images/'. $cur_letter .'/');
	if (!file_exists(UPLOAD_DIR)) {
		mkdir(UPLOAD_DIR, 0777, true);
	}
	$img = $_POST['imgBase64'];
	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
	$file = UPLOAD_DIR . uniqid() . '.png';
	$success = file_put_contents($file, $data);
	print $success ? $file : 'Unable to save the file.';
?>