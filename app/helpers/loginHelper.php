<?php
header('Access-Control-Allow-Origin: *');

include_once('../config/database.php');

$db = new Database();


$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$user = $request->username;
$pass = $request->password;

echo $user + " " + $pass;


?>