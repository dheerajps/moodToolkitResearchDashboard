<?php

header('Access-Control-Allow-Origin: *');
include_once('../config/database.php');
//require_once "sluWatchStudy.php";

//Get a new DB object and use it for this study
$db = new Database();

/**** Create the Return Array and keep populating it along the way *****/
$returnArray = array();

/**** Study Stats array to be populated for each user *****/
$study_stats = array();

//Query to get start date and end date for all the patients
$get_date_sql = "select patient , MAX(DATE_FORMAT(STR_TO_DATE(startts, '%c/%e/%Y'), '%Y-%m-%d ')) as endDate, MIN(DATE_FORMAT(STR_TO_DATE(startts, '%c/%e/%Y'), '%Y-%m-%d ')) as startDate from alcoholStudy where patient in (select Distinct patient from alcoholStudy) and afraid != 0 group by patient;";

$get_date_result = $db -> executeQuery($get_date_sql);

$dateResults = getQueryResults($get_date_result);

$get_total_days_sql = "select patient, COUNT(DISTINCT(DATE_FORMAT(STR_TO_DATE(startts, '%c/%e/%Y'), '%Y-%m-%d '))) As daysInStudy from alcoholStudy where afraid !=0 and patient in (select Distinct patient from alcoholStudy) group by patient;";

$get_total_days_result = $db -> executeQuery($get_total_days_sql);

$totalDaysResults = getQueryResults($get_total_days_result);
$search = "missed";
$get_missed_surveys_sql = "select patient, COUNT(*) as missedSurveys from alcoholStudy where patient in (select Distinct patient from alcoholStudy) and type1 LIKE '$search%' group by patient ;";

$get_missed_surveys_result = $db -> executeQuery($get_missed_surveys_sql);

$missedSurveysResults = getQueryResults($get_missed_surveys_result);

$get_completed_surveys_sql = "select patient, COUNT(*) as completedSurveys from alcoholStudy where patient in (select Distinct patient from alcoholStudy) and afraid!=0 group by patient ;";

$get_completed_surveys_result = $db -> executeQuery($get_completed_surveys_sql);

$completedSurveysResults = getQueryResults($get_completed_surveys_result);

$get_total_surveys_sql = "select patient, COUNT(*) as totalSurveys from alcoholStudy where patient in (select Distinct patient from alcoholStudy) group by patient;";

$get_total_surveys_result = $db -> executeQuery($get_total_surveys_sql);
//print_r($get_total_surveys_result);
$totalSurveysResults = getQueryResults($get_total_surveys_result);

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

/*** This loops through each patient object and adds all the properties at USER LEVEL ***/
$i=0;
$j=0;

foreach ($dateResults as $result) {

	$userInfo = intval($result["patient"]);

    date_default_timezone_set('America/Chicago');
    $startDate = date('F d Y', strtotime($result["startDate"]));
    $endDate = date('F d Y', strtotime($result["endDate"]));

    //make sure to check correct user gets correct value
    $study_stats[$j][$userInfo]['user'] = $userInfo;
    $study_stats[$j][$userInfo]['startDate'] = $startDate;
    $study_stats[$j][$userInfo]['endDate'] = $endDate;
    $study_stats[$j][$userInfo]['totalDays'] = intval($totalDaysResults[$i]["daysInStudy"]); 
    $study_stats[$j][$userInfo]['missedSurveys'] = intval($missedSurveysResults[$i]["missedSurveys"]);
    $study_stats[$j][$userInfo]['completedSurveys'] = intval($completedSurveysResults[$i]["completedSurveys"]);
    $study_stats[$j][$userInfo]['totalSurveys'] = intval($totalSurveysResults[$i]["totalSurveys"]);

    $i++;
    $j++;
}
$returnArray["userStudyStats"] = $study_stats;
echo json_encode($returnArray);
file_put_contents("alcoholStudyResponse.json",json_encode($returnArray));
?>