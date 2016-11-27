<?php
header('Access-Control-Allow-Origin: *');
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "test";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$study_surveys_sql = 'select patient, COUNT(*) from nimhTest where patient IN (select Distinct patient from nimhTest ) and afraid!="" group by patient;';
$study_surveys_result = $conn->query($study_surveys_sql);
$study_stats = array();


if ($study_surveys_result->num_rows > 0) {
    // output data of each row
    while($row = $study_surveys_result->fetch_assoc()) {
      $participant_survey = array();
      $participant_survey["user"] = $row["patient"];
      $participant_survey["survey-count"] = intval($row["COUNT(*)"]);
      array_push($study_stats, $participant_survey);
    }
}

$study_days_sql = "SELECT patient,COUNT(DISTINCT DATE_FORMAT(STR_TO_DATE(SurveyStart, '%c/%e/%Y %H:%i'), '%Y-%m-%d ')) AS dates from nimhTest where patient IN (select DISTINCT patient from nimhTest) and afraid!='' GROUP BY patient;";
$study_days_result = $conn->query($study_days_sql);
$conn->close();

if ($study_days_result->num_rows > 0) {
   $i = 0;
    while($row = $study_days_result->fetch_assoc()) {
      $study_stats[$i]["day-count"] = intval($row["dates"]);
      $i++;
    }
}
echo json_encode($study_stats);

?>
