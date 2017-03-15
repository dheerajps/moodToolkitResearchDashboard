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

//Get number of days in study 
$get_total_days_sql = "select patient, COUNT(DISTINCT(DATE_FORMAT(STR_TO_DATE(startts, '%c/%e/%Y'), '%Y-%m-%d '))) As daysInStudy from alcoholStudy where afraid !=0 and patient in (select Distinct patient from alcoholStudy) group by patient;";

$get_total_days_result = $db -> executeQuery($get_total_days_sql);

$totalDaysResults = getQueryResults($get_total_days_result);

//Get number of missed surveys for each patient
$search = "missed";
$get_missed_surveys_sql = "select patient, COUNT(*) as missedSurveys from alcoholStudy where patient in (select Distinct patient from alcoholStudy) and type1 LIKE '$search%' group by patient ;";

$get_missed_surveys_result = $db -> executeQuery($get_missed_surveys_sql);

$missedSurveysResults = getQueryResults($get_missed_surveys_result);

//Get completed surveys for each patient
$get_completed_surveys_sql = "select patient, COUNT(*) as completedSurveys from alcoholStudy where patient in (select Distinct patient from alcoholStudy) and afraid!=0 group by patient ;";

$get_completed_surveys_result = $db -> executeQuery($get_completed_surveys_sql);

$completedSurveysResults = getQueryResults($get_completed_surveys_result);

//Get total surveys prompted for each patient
$get_total_surveys_sql = 'select patient, COUNT(*) as totalSurveys from alcoholStudy where patient in (select Distinct patient from alcoholStudy) and (type1 != "Sensor connection" AND type1 != "")  group by patient;';

$get_total_surveys_result = $db -> executeQuery($get_total_surveys_sql);

$totalSurveysResults = getQueryResults($get_total_surveys_result);

//Get mood stats for each patient
$get_mood_stats_sql = "select participant,total_mood_changes,positive_changes,negative_changes from alcoholStudyStats order by participant;";

$get_mood_stats_result = $db -> executeQuery($get_mood_stats_sql);

$moodStatsResults = getQueryResults($get_mood_stats_result);

$get_all_participant_mood_stats_sql = "select * from alcoholStudyStats where participant = 1111;";

$get_all_participant_mood_result = $db -> executeQuery($get_all_participant_mood_stats_sql);

$allUsersMoodResults = getQueryResults($get_all_participant_mood_result);

/*** This loops through each patient object and adds all the properties at USER LEVEL ***/
$i=0;
$j=0;

foreach ($dateResults as $result) {

	$userInfo = intval($result["patient"]);

    date_default_timezone_set('America/Chicago');
    $startDate = date('F d Y', strtotime($result["startDate"]));
    $endDate = date('F d Y', strtotime($result["endDate"]));
    $missedSurveys = intval($missedSurveysResults[$i]["missedSurveys"]);
    $completedSurveys = intval($completedSurveysResults[$i]["completedSurveys"]);
    $totalSurveys = intval($totalSurveysResults[$i]["totalSurveys"]);

    //make sure to check correct user gets correct value
    $study_stats[$j]['user'] = $userInfo;
    $study_stats[$j]['startDate'] = $startDate;
    $study_stats[$j]['endDate'] = $endDate;
    $study_stats[$j]['totalDays'] = intval($totalDaysResults[$i]["daysInStudy"]); 
    $study_stats[$j]['missedSurveys'] = intval($missedSurveysResults[$i]["missedSurveys"]);
    $study_stats[$j]['completedSurveys'] = intval($completedSurveysResults[$i]["completedSurveys"]);
    $study_stats[$j]['totalSurveys'] = intval($totalSurveysResults[$i]["totalSurveys"]);
    $study_stats[$j]['compliance'] = ($totalSurveys - $missedSurveys)/$totalSurveys;
    $study_stats[$j]['totalMoodChanges'] = intval($moodStatsResults[$i]["total_mood_changes"]);
    $study_stats[$j]['posMoodChanges'] = intval($moodStatsResults[$i]["positive_changes"]);
    $study_stats[$j]['negMoodChanges'] = intval($moodStatsResults[$i]["negative_changes"]);


    $i++;
    $j++;
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
$returnArray["totalMoodStats"] = $allUsersMoodResults;
$returnArray["userStudyStats"] = $study_stats;

echo json_encode($returnArray);
file_put_contents("alcoholStudyResponse.json",json_encode($returnArray));
?>