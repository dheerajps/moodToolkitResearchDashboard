<?php
header('Access-Control-Allow-Origin: *');

include_once('../config/database.php');

$db = new Database();

function generateSalt($max = 64) {
	$characterList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*?";
	$i = 0;
	$salt = "";
	while ($i < $max) {
	    $salt .= $characterList{mt_rand(0, (strlen($characterList) - 1))};
	    $i++;
	}
	return $salt;
}

// $username = "admin";
// $password = "abc123$";

// $user_salt = generateSalt(); // Generates a salt from the function above
// $combo = $user_salt . $password; // Appending user password to the salt 
// $hashed_pwd = hash('sha512',$combo); // Using SHA512 to hash the salt+password combo string


// $insert_sql = "INSERT INTO userInfo(USERNAME,PASSWORD,SALT) VALUES ('$username','$hashed_pwd','$user_salt')";
// $insert_result = $db -> executeQuery($insert_sql);
// echo "$insert_result";
$data = file_get_contents("php://input");
parse_str($data,$formData);


$msg = " From php: " .$formData['username']. "and pass: ". $formData['password'];
//echo "$user" + "$pass";
// $select_user_sql = 'SELECT * from userInfo where USERNAME ="'.$user.'"';
// $select_user_result = $db-> executeQuery($select_user_sql);
// $row= $select_user_result->fetch_assoc();
// $stored_salt = $row['salt'];
// $stored_hash = $row['password'];
// $check_pass = $stored_salt . $pass;
// $check_hash = hash('sha512',$check_pass);
// if($check_hash == $stored_hash){
//         echo "User authenticated";
// }
// else{
//         echo "Not authenticated";
// }
// // echo $user + " " + $pass;
echo $msg;
$db->closeConnection();
?>