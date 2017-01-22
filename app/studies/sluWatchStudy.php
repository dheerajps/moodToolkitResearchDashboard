<?php
header('Access-Control-Allow-Origin: *');
include_once('../config/database.php');

//Get a new DB object and use it for this study
$db = new Database();

/**** Create the Return Array and keep populating it along the way *****/
$returnArray = array();

/**** Study Stats array to be populated for each user *****/

$study_stats = array();

//Query to get all the patients in this study
$patients_sql = 'select distinct patient from sluWatch';
$patients_result = $db -> executeQuery($patients_sql);
if($patients_result -> num_rows > 0){
	while($row = $patients_result->fetch_assoc()){

		$participant_survey = array();
		$participant_survey["user"]= intval($row["patient"]);
		array_push($study_stats,$participant_survey);
	}
}
//Query to get all the patients skin temperature in the order of week,day,hour 
$skin_temp_sql = 'select patient, WEEK(datetime) as weekInfo, DATE(datetime) as dateInfo, HOUR(datetime) as hourInfo, avg(skin_temp) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and skin_temp >0 Group by HOUR(datetime),DATE(datetime),WEEK(datetime),patient order by patient,WEEK(datetime),DATE(datetime), HOUR(datetime)';

$skin_temp_result = $db -> executeQuery($skin_temp_sql);

if($skin_temp_result -> num_rows > 0){
	$i=0;
	$results = array();
	while($row = $skin_temp_result -> fetch_assoc()){
		$results[$i] = $row;
		$i++;
	}
}
/***** The whole result is stored iteratively in this array to be indexed in the Return Array *****/

$skinTempResult = array();
foreach ($results as $result) {
    //Get individual fields of each query row
	$id = intval($result["patient"]);
	$weekInfo = intval($result["weekInfo"]);
	date_default_timezone_set('America/Chicago');
	$dateInfo = date('m-d-Y', strtotime($result["dateInfo"]));
	$hourInfo = intval($result["hourInfo"]);
	$avg = floatval($result["avg"]);

    //Contruct the array in the order of ID->WEEKS->DAYS->HOURS
	if(!isset($skinTempResult[$id]['weeks'])) {
        $skinTempResult[$id]['weeks'] = array();
    }
    if($weekInfo && !isset($skinTempResult[$id]['weeks'][$weekInfo])){
    	$week = array(
    		'weekNumber' => intval($result["weekInfo"]),
    		'dates' => array()
    		);
    	$skinTempResult[$id]['weeks'][$weekInfo] = $week;
    }
    if($dateInfo && isset($skinTempResult[$id]['weeks'][$weekInfo]) && !isset($skinTempResult[$id]['weeks'][$weekInfo]['dates'][$dateInfo])){
    	date_default_timezone_set('America/Chicago');
    	$date = array(
    		'dateNumber' => date('m-d-Y', strtotime($result["dateInfo"])),
    		'hours' => array()
    		);
    	$skinTempResult[$id]['weeks'][$weekInfo]['dates'][$dateInfo] = $date;
    }
    if($hourInfo && isset($skinTempResult[$id]['weeks'][$weekInfo]) && isset($skinTempResult[$id]['weeks'][$weekInfo]['dates'][$dateInfo]) && !isset($skinTempResult[$id]['weeks'][$weekInfo]['dates'][$dateInfo]['hours'][$hourInfo])){
    	$hour = array(
    		'hourNumber' => intval($result["hourInfo"]),
    		'avg' => floatval($result["avg"])
    		);
    	$skinTempResult[$id]['weeks'][$weekInfo]['dates'][$dateInfo]['hours'][$hourInfo] = $hour;
    }
}


/***** Close current db connection *****/

$db->closeConnection();

/***** Add the arrays at right indices *****/

$returnArray["skinTemp"] = $skinTempResult;
$returnArray["studyStats"] = $study_stats;
echo json_encode($returnArray);
?>