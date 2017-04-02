<?php
/** DELETE USER END POINT FOR ADMIN page **/

header('Access-Control-Allow-Origin: *');

require_once('../../config/database.php');

$db = new Database();

$returnArray = array();

$data = file_get_contents("php://input");
parse_str($data,$userData);

$userId = $userData['ID'];
$select_user_sql = "SELECT 1 FROM userInfo where ID = ".$userId." ; ";
$select_user_result = $db -> executeQuery($select_user_sql);
if($select_user_result -> num_rows >0){
	$delete_user_sql = "DELETE FROM userInfo where ID = ". $userId ." ; ";
	$delete_user_result = $db -> executeQuery($delete_user_sql);
	$msg = "User " . $userData['username'] ." has been removed from the system";
	$status = 1;
}
else{
	$msg = "Something went wrong! \n Please try again later!";
	$status = 0;
}



$returnArray['status'] = $status;
$returnArray['msg'] = $msg;

echo json_encode($returnArray);

$db->closeConnection();

?>