<?php
header('Access-Control-Allow-Origin: *');

include_once('../config/database.php');

$db = new Database();
$loginInfo = array();
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

$user = $formData['username'];
$pass = $formData['password'];

$select_user_sql = "SELECT * from userInfo where USERNAME = '$user'";

$select_user_result = $db-> executeQuery($select_user_sql);
if($select_user_result->num_rows > 0){

	$row= $select_user_result->fetch_assoc();
	json_encode($row);
	$stored_salt = $row['SALT'];
	$stored_hash = $row['PASSWORD'];
	$check_pass = $stored_salt . $pass;
	$check_hash = hash('sha512',$check_pass);
	if($check_hash == $stored_hash){
	        $msg= "User authenticated";
	        $login = true;
	}
	else{
	        $msg= "Not authenticated: Please Enter the right Username and Password";
	        $login =false;
	}
}
else{
	$msg= "Not authenticated: Please Enter the right Username and Password";
	$login = false;
} 
$loginInfo['msg']= $msg;
$loginInfo['status'] = $login;
echo json_encode($loginInfo);
$db->closeConnection();
?>