<?php
/** GET USERS END POINT FOR ADMIN page **/

header('Access-Control-Allow-Origin: *');

require_once('../../config/database.php');

$db = new Database();

$returnArray = array();

function getQueryResults($queryResult)
{
    if($queryResult -> num_rows > 0){
        $i=0;
        $results = array();
        while($row = $queryResult -> fetch_assoc()){
            $results[$i] = $row;
            $i++;
        }
        return $results;
    }
    else {
        echo "No results returned" . "\n";
    }
}

function constructUserArray($sqlResult){

	$j=0;
	$user = array();
	foreach ($sqlResult as $result) {

		$users[$j]['username'] = $result['USERNAME'];
		$users[$j]['fname'] = $result['FirstName'];
		$users[$j]['lname'] = $result['LastName'];
		$users[$j]['email'] = $result['EMAIL'];
		$users[$j]['affiliation'] = $result['AFFILIATION'];

		$j++;
	}
	return $users;
}


//Get all existing users who are approved only

$get_all_existing_users_sql = " SELECT * FROM userInfo WHERE isApproved = 'T' ";
$get_all_existing_users_result = $db -> executeQuery($get_all_existing_users_sql);
$getExistingUsers = getQueryResults($get_all_existing_users_result);
$existingUsers = constructUserArray($getExistingUsers);

//Get all users who are not approved only

$get_new_users_sql = " SELECT * FROM userInfo WHERE isApproved = 'F' ";
$get_new_users_result = $db -> executeQuery($get_new_users_sql);
if($get_new_users_result!=null){
	$getNewUsers = getQueryResults($get_new_users_result);

	if($getNewUsers!=null){
		$newUsers = constructUserArray($getNewUsers);
	}
	else{
		$newUsers = null;
	}
}


$returnArray['existingUsers'] = $existingUsers;
$returnArray['newUsers'] = $newUsers;

echo json_encode($returnArray);
$db->closeConnection();

?>
