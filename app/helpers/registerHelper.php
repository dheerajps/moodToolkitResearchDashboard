<?php
header('Access-Control-Allow-Origin: *');

require_once('../config/database.php');


$db = new Database();
$registerInfo =array();

$data = file_get_contents("php://input");
parse_str($data,$formData);


function generateSalt($max = 64) {
	$characterList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*?";
	$i = 0;
	$salt = "";
	while ($i < $max) {
	    $salt .= $characterList{mt_rand(0, (strlen($characterList) - 1))}; //better than rand()
	    $i++;
	}
	return $salt;
}


$username =  trim($formData['username']);
$username = strip_tags($username);

$password =  trim($formData['password']);
$password = strip_tags($password);

$firstName = trim($formData['fname']);
$firstName = strip_tags($firstName);

$lastName = strip_tags(trim($formData['lname']));

$email = trim($formData['email']);

$universityAffiliation = strip_tags($formData['affiliation']);
$universityAffiliation = strip_tags($universityAffiliation);

$user_salt = generateSalt(); // Generates a salt from the function above
$combo = $user_salt . $password; // Appending user password to the salt 
$hashed_pwd = hash('sha512',$combo); // Using SHA512 to hash the salt+password combo string

/* check if user is present */

$check_username_sql = "SELECT * FROM userInfo WHERE USERNAME = '$username'";
$check_username_result = $db -> executeQuery($check_username_sql);

$check_email_sql = "SELECT * FROM userInfo WHERE EMAIL = '$email'";
$check_email_result = $db -> executeQuery($check_email_sql);

//This will allow people with same username to register, but different email-ids
if($check_username_result -> num_rows > 0 && $check_email_result -> num_rows >0 ){
	$msg = "This username already exists with this email. Please login, else, contact admin";
	$registerStatus = 2;
}
else if($check_email_result -> num_rows > 0){
	$msg = "This email id is already on our file. Please login with the username, else, contact admin";
	$registerStatus = 2;
}
else{
	$insert_sql = "INSERT INTO userInfo(USERNAME,PASSWORD,SALT,FirstName,LastName,EMAIL,AFFILIATION) VALUES ('$username','$hashed_pwd','$user_salt','$firstName','$lastName','$email','$universityAffiliation')";
	$insert_result = $db -> executeQuery($insert_sql);

	if(!$insert_result){
		$msg = "Something went wrong Please try again, or contact admin";
		$registerStatus = 0;
	}
	else{
		$msg = "Registration success.\n You will be authorized to login from the admin within 24 hours.";
		

		$subject = "Registration Mood ToolKit Dashboard";


		$body = "<div>
				<h1 style='color:#000000;font-family: Arial, Helvetica, sans-serif;text-align:center;line-height:2.5em;'>Thank you for signing up!</h1>
				<hr>
				<table>
				<tr><td style='text-align:center'>
				<div>
				<p style='color:#000000; font-family: Allura,cursive,Arial, Helvetica, sans-serif; font-size:20px'>The admin will grant access to the app within the next 24 hours. If you have not received a confirmation email within 24 hours, please contact <b>Tim Trull : trullt@missouri.edu</b></p>
				</div>
				</td>
				</tr>
				</table>
				<label>Firstname:  </label><span>".$firstName."</span><br>
				<label>Lastname:  </label><span>".$lastName."</span><br>
				<label>Email-Id:  </label><span>".$email."</span><br>
				<label>Username:  </label><span>".$username."</span><br>
				<label>University Affiliation:  </label><span>".$universityAffiliation."</span><br>

				</div>";
		// Always set content-type when sending HTML email
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

		// More headers
		$headers .= "";
		$headers .= 'Bcc: sdheeraj1992@gmail.com' . "\r\n";

		// send email
		//mail("dpstm3@mail.missouri.edu",$subject,$body,$headers);
		$registerStatus = 1;
	}
}
/*Load the register info to send back response */
$registerInfo['msg'] = $msg;
$registerInfo['status'] = $registerStatus;

echo json_encode($registerInfo);
$db->closeConnection();
?>