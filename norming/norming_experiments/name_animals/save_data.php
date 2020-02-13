<?php
$post_data = json_decode(file_get_contents('php://input'), true);
// the directory "data" is writable by the server (chmod 777)
$filename = "data/".$post_data['filename'].".csv";
$data = $post_data['filedata'];
// check to make sure file doesn't already exist; if it does, add a character "A" to the front of the filename
if (file_exists($filename)) {
	$temp="A".$post_data['filename'].".csv";
    $filename="data/".$temp;
} 
// write the file to disk
file_put_contents($filename, $data);
?>