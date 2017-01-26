<?php
header('Access-Control-Allow-Origin: *');
include_once('../config/database.php');

//Get a new DB object and use it for this study
$db = new Database();

/**** Create the Return Array and keep populating it along the way *****/
$returnArray = array();

/**** Study Stats array to be populated for each user *****/

$study_stats = array();

//Query to get average skin temperature of each patient in the order of date,hour 
$skin_temp_hourly_sql = 'select patient, DATE(datetime) as dateInfo,HOUR(datetime) as hourInfo, avg(skin_temp) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and skin_temp >0 Group by HOUR(datetime),DATE(datetime),patient order by patient,DATE(datetime),HOUR(datetime)';

$skin_temp_hourly_result = $db -> executeQuery($skin_temp_hourly_sql);
$results = getQueryResults($skin_temp_hourly_result);

/***** The whole result is stored iteratively in this array to be indexed in the Return Array *****/
$skinTempResult = array();
foreach ($results as $result) {
    //Get individual fields of each query row
	$id = intval($result["patient"]);
	date_default_timezone_set('America/Chicago');
	$dateInfo = date('m-d-Y', strtotime($result["dateInfo"]));
	$hourInfo = intval($result["hourInfo"]);
	$avg = floatval($result["avg"]);

    //Contruct the array in the order of ID->DAYS->HOURS
	if(!isset($skinTempResult[$id]['dates'])) {
        $skinTempResult[$id]['dates'] = array();
    }
    if($dateInfo && !isset($skinTempResult[$id]['dates'][$dateInfo])){
        date_default_timezone_set('America/Chicago');
    	$date = array(
    		'dateValue' => date('m-d-Y', strtotime($result["dateInfo"])),
    		'hours' => array()
    		);
        
    	$skinTempResult[$id]['dates'][$dateInfo] = $date;
    }
    if($hourInfo && isset($skinTempResult[$id]['dates'][$dateInfo]) && !isset($skinTempResult[$id]['dates'][$dateInfo]['hours'][$hourInfo])){
    	$hour = array(
    		'hourValue' => intval($result["hourInfo"]),
    		'avg' => floatval($result["avg"])
    		);
        
    	$skinTempResult[$id]['dates'][$dateInfo]['hours'][$hourInfo] = $hour;
    }
}

//Query to get avg skin temp for each patient per date
$skin_temp_daily_sql = 'select patient, DATE(datetime) as dateInfo,avg(skin_temp) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and skin_temp >0 Group by DATE(datetime),patient order by patient,DATE(datetime)';
$skin_temp_daily_result = $db -> executeQuery($skin_temp_daily_sql);

$dailyResults = getQueryResults($skin_temp_daily_result);

$skinTempDailyResult = array();

foreach ($dailyResults as $result) {
    
    $dateInfo = date('m-d-Y', strtotime($result["dateInfo"]));
    $id = intval($result["patient"]);
    $avg = floatval($result["avg"]);

    if(!isset($skinTempDailyResult[$id]['dates'])){
        $skinTempDailyResult[$id]['dates'] = array();
    }
    if($dateInfo && !isset($skinTempDailyResult[$id]["dates"][$dateInfo])){
        $date = array(
            'date' => $dateInfo,
            'avg' => $avg);
        $skinTempDailyResult[$id]["dates"][$dateInfo] = $date;
    }
}

//Query to get start date and end date for all the patients
$get_date_sql = "select patient, MAX(DATE(datetime)) as endDate, MIN(DATE(datetime)) as startDate, DATEDIFF(MAX(DATE(datetime)), MIN(DATE(datetime))) as totalDays from sluWatch where patient in (select Distinct Patient from sluWatch) group by patient";
$get_date_result = $db -> executeQuery($get_date_sql);

$dateResults = getQueryResults($get_date_result);
$i=0;
foreach ($dateResults as $result) {
    date_default_timezone_set('America/Chicago');
    $startDate = date('F d Y', strtotime($result["startDate"]));
    $endDate = date('F d Y', strtotime($result["endDate"]));
    $study_stats[$i]["user"] = intval($result["patient"]);
    $study_stats[$i]["startDate"] = $startDate;
    $study_stats[$i]["endDate"] = $endDate;
    $study_stats[$i]["totalDays"] = intval($result["totalDays"]);
    $i++;
}

//Query to get average heart rate for each patient in the order of date, hour
$heart_rate_hourly_sql = 'select patient, DATE(datetime) as dateInfo,HOUR(datetime) as hourInfo, avg(heartrate) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and heartrate >0 Group by HOUR(datetime),DATE(datetime),patient order by patient,DATE(datetime),HOUR(datetime)';
$heart_rate_hourly_result = $db -> executeQuery($heart_rate_hourly_sql);
$hourlyHeartResults = getQueryResults($heart_rate_hourly_result);

$heartRateResult = array();

foreach ($hourlyHeartResults as $result) {
    $id = intval($result["patient"]);
    date_default_timezone_set('America/Chicago');
    $dateInfo = date('m-d-Y', strtotime($result["dateInfo"]));
    $hourInfo = intval($result["hourInfo"]);
    $avg = floatval($result["avg"]);

    //Contruct the array in the order of ID->DAYS->HOURS
    if(!isset($heartRateResult[$id]['dates'])) {
        $heartRateResult[$id]['dates'] = array();
    }
    if($dateInfo && !isset($heartRateResult[$id]['dates'][$dateInfo])){
        date_default_timezone_set('America/Chicago');
        $date = array(
            'dateValue' => date('m-d-Y', strtotime($result["dateInfo"])),
            'hours' => array()
            );
        
        $heartRateResult[$id]['dates'][$dateInfo] = $date;
    }
    if($hourInfo && isset($heartRateResult[$id]['dates'][$dateInfo]) && !isset($heartRateResult[$id]['dates'][$dateInfo]['hours'][$hourInfo])){
        $hour = array(
            'hourValue' => intval($result["hourInfo"]),
            'avg' => floatval($result["avg"])
            );
        
        $heartRateResult[$id]['dates'][$dateInfo]['hours'][$hourInfo] = $hour;
    }
}

//Query to get avg heart rate for each patient by date

$heart_rate_daily_sql ='select patient, DATE(datetime) as dateInfo,avg(heartrate) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and heartrate >0 Group by DATE(datetime),patient order by patient,DATE(datetime)';
$heart_rate_daily_result = $db -> executeQuery($heart_rate_daily_sql);

$dailyHeartRateResults = getQueryResults($heart_rate_daily_result);


$heartRateDailyResult = array();
foreach ($dailyHeartRateResults as $result) {

    $dateInfo = date('m-d-Y', strtotime($result["dateInfo"]));
    $id = intval($result["patient"]);
    $avg = floatval($result["avg"]);

    if(!isset($heartRateDailyResult[$id]['dates'])){
        $heartRateDailyResult[$id]['dates'] = array();
    }
    if($dateInfo && !isset($heartRateDailyResult[$id]["dates"][$dateInfo])){
        $date = array(
            'date' => $dateInfo,
            'avg' => $avg);
        $heartRateDailyResult[$id]["dates"][$dateInfo] = $date;
    }
}
/*** Function to return the query results in the form of an array ***/
function getQueryResults($queryResult)
{
    if($queryResult -> num_rows > 0){
        $i=0;
        $results = array();
        while($row = $queryResult -> fetch_assoc()){
            $results[$i] = $row;
            $i++;
        }
    }
    return $results;
}
/***** Close current db connection *****/

$db->closeConnection();

/***** Add the arrays at right indices *****/

$returnArray["skinTempHourly"] = $skinTempResult;
$returnArray["skinTempDaily"] = $skinTempDailyResult;
$returnArray["heartRateHourly"] = $heartRateResult;
$returnArray["heartRateDaily"] = $heartRateDailyResult;
$returnArray["studyStats"] = $study_stats;
echo json_encode($returnArray);
?>