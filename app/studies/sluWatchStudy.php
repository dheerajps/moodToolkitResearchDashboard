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

$hourlySkinTempResults = getQueryResults($skin_temp_hourly_result);

$skinTempHourlyResult = loadHourlyMetrics($hourlySkinTempResults);

//Query to get avg skin temp for each patient per date
$skin_temp_daily_sql = 'select patient, DATE(datetime) as dateInfo,avg(skin_temp) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and skin_temp >0 Group by DATE(datetime),patient order by patient,DATE(datetime)';
$skin_temp_daily_result = $db -> executeQuery($skin_temp_daily_sql);

$dailySkinTempResults = getQueryResults($skin_temp_daily_result);

$skinTempDailyResult = loadDailyMetrics($dailySkinTempResults);

//Query to get average heart rate for each patient in the order of date, hour
$heart_rate_hourly_sql = 'select patient, DATE(datetime) as dateInfo,HOUR(datetime) as hourInfo, avg(heartrate) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and heartrate >0 Group by HOUR(datetime),DATE(datetime),patient order by patient,DATE(datetime),HOUR(datetime)';
$heart_rate_hourly_result = $db -> executeQuery($heart_rate_hourly_sql);

$hourlyHeartResults = getQueryResults($heart_rate_hourly_result);

$heartRateHourlyResult = loadHourlyMetrics($hourlyHeartResults);

//Query to get avg heart rate for each patient by date
$heart_rate_daily_sql ='select patient, DATE(datetime) as dateInfo,avg(heartrate) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and heartrate >0 Group by DATE(datetime),patient order by patient,DATE(datetime)';
$heart_rate_daily_result = $db -> executeQuery($heart_rate_daily_sql);

$dailyHeartRateResults = getQueryResults($heart_rate_daily_result);

$heartRateDailyResult = loadDailyMetrics($dailyHeartRateResults);

//Query to get start date and end date for all the patients
$get_date_sql = 'select patient, MAX(DATE(datetime)) as endDate, MIN(DATE(datetime)) as startDate, DATEDIFF(MAX(DATE(datetime)), MIN(DATE(datetime))) as totalDays from sluWatch where patient in (select Distinct Patient from sluWatch) group by patient';
$get_date_result = $db -> executeQuery($get_date_sql);

$dateResults = getQueryResults($get_date_result);

//Query to get the neg,pos,impulsivity,ciggaretes,drinks for each patient across the study
$get_slu_stats_sql = 'select cast(patient as unsigned) as userInfo, avg(neg_avg) as negAvg, avg(pos_avg) as posAvg, avg(impulsivity_avg) as impulsivityAvg, MAX(number_of_cigarettes) as numberCigs, MAX(number_of_drinks) as numberDrinks from sluWatchStats where patient IN ( select distinct patient from sluWatchStats) group by patient';
$get_slu_stats_results = $db -> executeQuery($get_slu_stats_sql);

$sluStatsResults = getQueryResults($get_slu_stats_results);


$i=0;
/*** This loops through each patient and adds a property ***/
foreach ($dateResults as $result) {

    $userInfo = intval($result["patient"]);

    date_default_timezone_set('America/Chicago');
    $startDate = date('F d Y', strtotime($result["startDate"]));
    $endDate = date('F d Y', strtotime($result["endDate"]));

    
    $study_stats[$userInfo]["user"] = intval($result["patient"]);
    $study_stats[$userInfo]["startDate"] = $startDate;
    $study_stats[$userInfo]["endDate"] = $endDate;
    $study_stats[$userInfo]["totalDays"] = intval($result["totalDays"]);


    $study_stats[$userInfo]["heartRateDaily"] = $heartRateDailyResult[$userInfo];
    $study_stats[$userInfo]["heartRateHourly"] = $heartRateHourlyResult[$userInfo];

    $study_stats[$userInfo]["skinTempDaily"] = $skinTempDailyResult[$userInfo];
    $study_stats[$userInfo]["skinTempHourly"] = $skinTempHourlyResult[$userInfo];


    $study_stats[$userInfo]["negAvg"] = floatval($sluStatsResults[$i]["negAvg"]);
    $study_stats[$userInfo]["posAvg"] = floatval($sluStatsResults[$i]["posAvg"]);
    $study_stats[$userInfo]["impulsivityAvg"] = floatval($sluStatsResults[$i]["impulsivityAvg"]);
    $study_stats[$userInfo]["cigarettes"] = intval($sluStatsResults[$i]["numberCigs"]);
    $study_stats[$userInfo]["drinksConsumed"] = intval($sluStatsResults[$i]["numberDrinks"]);

    $i++;
}

/*** Function to load hourly results for each day for each patient for a given metric Patient -> dates[]->date->hours[]-> hour->avg ***/
function loadHourlyMetrics($hourlyResults){

    $hourlyLoadArray = array();
    foreach ($hourlyResults as $result) {
        $id = intval($result["patient"]);
        date_default_timezone_set('America/Chicago');
        $dateInfo = date('m-d-Y', strtotime($result["dateInfo"]));
        $hourInfo = intval($result["hourInfo"]);
        $avg = floatval($result["avg"]);

        //Contruct the array in the order of ID->DAYS->HOURS
        if(!isset($hourlyLoadArray[$id]['dates'])) {
            $hourlyLoadArray[$id]['dates'] = array();
        }
        if($dateInfo && !isset($hourlyLoadArray[$id]['dates'][$dateInfo])){
            date_default_timezone_set('America/Chicago');
            $date = array(
                'dateValue' => date('m-d-Y', strtotime($result["dateInfo"])),
                'hours' => array()
                );
            
            $hourlyLoadArray[$id]['dates'][$dateInfo] = $date;
        }
        if($hourInfo && isset($hourlyLoadArray[$id]['dates'][$dateInfo]) && !isset($hourlyLoadArray[$id]['dates'][$dateInfo]['hours'][$hourInfo])){
            $hour = array(
                'hourValue' => intval($result["hourInfo"]),
                'avg' => floatval($result["avg"])
                );
            
            $hourlyLoadArray[$id]['dates'][$dateInfo]['hours'][$hourInfo] = $hour;
        }
    }
    return $hourlyLoadArray;
}



/*** Function to load Daily results for each metric provided Patient->dates[]->date->avg ***/

function loadDailyMetrics($dailyResults){

    $dailyLoadArray = array();
    foreach ($dailyResults as $result) {

        $dateInfo = date('m-d-Y', strtotime($result["dateInfo"]));
        $id = intval($result["patient"]);
        $avg = floatval($result["avg"]);

        if(!isset($dailyLoadArray[$id]['dates'])){
            $dailyLoadArray[$id]['dates'] = array();
        }
        if($dateInfo && !isset($dailyLoadArray[$id]["dates"][$dateInfo])){
            $date = array(
                'date' => $dateInfo,
                'avg' => $avg);
            $dailyLoadArray[$id]["dates"][$dateInfo] = $date;
        }
    }
    return $dailyLoadArray;
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
    else {
        echo "error getting query results";
    }
    return $results;
}
/***** Close current db connection *****/

$db->closeConnection();

/***** Add the arrays at right indices *****/

$returnArray["studyStats"] = $study_stats;
echo json_encode($returnArray);
?>