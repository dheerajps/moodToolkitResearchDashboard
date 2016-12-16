/*
NIMH STUDY QUERIES.
*/

/*Query 1: Number of valid completed surveys for a single user*/
select COUNT(*)from nimhTest where patient =1001 and afraid !="";
/*Query 2: Number of total surveys for a given patient*/
select COUNT(*)from nimhTest where patient =1001;
/*Query 3: To get the compliance divide 1 over 2*/
/*Query 4: Total number of completed surveys across all patients*/
select COUNT(*) from nimhTest where patient IN (select Distinct patient from nimhTest ) and afraid!="";
/*Query 5: Total number of surveys across all patients*/
select COUNT(*) from nimhTest where patient IN (select Distinct patient from nimhTest );
/*Query 6: Number of completed surveys for all patients as a a key - value pair */
select patient, COUNT(*) from nimhTest where patient IN (select Distinct patient from nimhTest ) and afraid!="" group by patient;
/*Query 7: Active Days in study for all patients as a key value pair*/
SELECT patient,COUNT(DISTINCT DATE_FORMAT(STR_TO_DATE(SurveyStart, '%c/%e/%Y %H:%i'), '%Y-%m-%d ')) AS dates from nimhTest where patient IN (select DISTINCT patient from nimhTest) and afraid!="" GROUP BY patient;
/* Query 8: Getting the start date of a given patient*/
SELECT DISTINCT DATE_FORMAT(STR_TO_DATE(SurveyStart, '%c/%e/%Y %H:%i'), '%Y-%m-%d ') as startDate FROM nimhTest WHERE patient=1001 and afraid != "" LIMIT 1;
/* Query 9: Getting the end date of a given patient */
SELECT DATE_FORMAT(STR_TO_DATE(SurveyStart, '%c/%e/%Y %H:%i'), '%Y-%m-%d ') as endDate FROM nimhTest WHERE patient=1001 and afraid != "" ORDER BY SurveyStart DESC LIMIT 1;
/* Query 10: Getting mood changes for all patients */
select * from nimhTestStats where participant=1111;
/* Query 11: Get total mood changes for an individual patient along with positive and negative changes, this is for the mood changes graph*/
select participant,total_mood_changes,positive_changes,negative_changes from nimhTestStats order by participant;



