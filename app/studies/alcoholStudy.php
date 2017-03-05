<?php

header('Access-Control-Allow-Origin: *');
include_once('../config/database.php');

//Get a new DB object and use it for this study
$db = new Database();

/**** Create the Return Array and keep populating it along the way *****/
$returnArray = array();

/**** Study Stats array to be populated for each user *****/
$study_stats = array();


$returnArray["userStudyStats"] = $study_stats;
file_put_contents("alcoholStudyResponse.json",json_encode($returnArray));
?>