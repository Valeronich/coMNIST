<?php
	// requires php5
	$name = $_POST['name'];
	$email = $_POST['email'];
    $count= $_POST['count'];
    $file = 'userdata.txt';
	

    // Open the file to get existing content
    $current = file_get_contents($file);
    // Append a new person to the file
    $current .= $name . "," . $email . ",". $count ."\r\n";
    // Write the contents back to the file
	$success = file_put_contents($file, $current, FILE_APPEND | LOCK_EX);
	print $success ? $file : 'Unable to save the file.';
?>