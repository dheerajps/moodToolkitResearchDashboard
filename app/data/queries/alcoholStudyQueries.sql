/* ALCOHOL STUDY QUERIES */

/* GET START AND END DATE of every patient */
select patient , MAX(DATE_FORMAT(STR_TO_DATE(startts, '%c/%e/%Y'), '%Y-%m-%d ')) as endDate, MIN(DATE_FORMAT(STR_TO_DATE(startts, '%c/%e/%Y'), '%Y-%m-%d ')) as startDate from alcoholStudy where patient in (select Distinct patient from alcoholStudy) and afraid !=0 group by patient;
/* GET TOTAL DAYS IN STUDY */
select patient,COUNT(DISTINCT(DATE_FORMAT(STR_TO_DATE(startts, '%c/%e/%Y'), '%Y-%m-%d '))) As daysInStudy from alcoholStudy where afraid !=0 and patient in (select Distinct patient from alcoholStudy) group by patient;
/* GET MISSED SURVEYS FOR EACH PATIENT */
select patient, count(*)  from alcoholStudy where patient in (select Distinct patient from alcoholStudy) and type1 like 'missed%' group by patient ;
/* GET COMPLETED SURVEYS FOR EACH PATIENT */
select patient, COUNT(*)  from alcoholStudy where patient in (select Distinct patient from alcoholStudy) and afraid!=0 group by patient ;
/* GET TOTAL SURVEYS FOR EACH PATIENT */
select patient, COUNT(*)  from alcoholStudy where patient in (select Distinct patient from alcoholStudy) group by patient;