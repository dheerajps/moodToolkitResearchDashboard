<?php
/** APPROVE USER END POINT FOR ADMIN page **/

header('Access-Control-Allow-Origin: *');

require_once('../../config/database.php');

$db = new Database();

$returnArray = array();

$data = file_get_contents("php://input");
parse_str($data,$userData);

$userId = $userData['ID'];
$select_user_sql = "SELECT * FROM userInfo where ID = ".$userId." ; ";
$select_user_result = $db -> executeQuery($select_user_sql);

if($select_user_result -> num_rows >0){

	$row = $select_user_result -> fetch_assoc();

	if($row['isApproved'] === 'F'){

		$approve_user_sql = "UPDATE userInfo SET isApproved = 'T' where ID = ". $userId ." ; ";
		$approve_user_result = $db -> executeQuery($approve_user_sql);
		if(json_encode($approve_user_result)){

			$msg = "User " . $row['USERNAME'] ." has been approved to access the system";
			$status = 1;
			$subject = "Access to Mood ToolKit Dashboard";


			$body = "<div>
					<h1 style='color:#000000;font-family: Arial, Helvetica, sans-serif;text-align:center;line-height:2.5em;'>APPROVED!!</h1>
					<hr>
					<table>
					<tr><td style='text-align:center'>
					<div>
					<p style='color:#000000; font-family: Allura,cursive,Arial, Helvetica, sans-serif; font-size:20px'>You have been authorized and granted access to the Mood Toolkit Application. If you have any questions, please contact <b>Tim Trull : trullt@missouri.edu</b></p>
					</div>
					</td>
					</tr>
					</table>
					<label>Firstname:  </label><span>".$row['FirstName']."</span><br>
					<label>Lastname:  </label><span>".$row['LastName']."</span><br>
					<label>Email-Id:  </label><span>".$row['EMAIL']."</span><br>
					<label>Username:  </label><span>".$row['USERNAME']."</span><br>
					<label>University Affiliation:  </label><span>".$row['AFFILIATION']."</span><br>

					</div>";
			// Always set content-type when sending HTML email
			$headers = "MIME-Version: 1.0" . "\r\n";
			$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

			// More headers
			$headers .= "";
			$headers .= 'Bcc: sdheeraj1992@gmail.com' . "\r\n";

			// send email
			//mail("dpstm3@mail.missouri.edu",$subject,$body,$headers);
		}
	}
	
}
else{

	$msg = "Something went wrong! \n Please try again later!";
	$status = 0;
}

$returnArray['msg'] = $msg;
$returnArray['status'] = $status;

echo json_encode($returnArray);

$db->closeConnection();

?>