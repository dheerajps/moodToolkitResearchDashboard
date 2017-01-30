/* SLU WATCH DATA QUERIES */

/* Query 1: Average skin temp for each hour recorded of each day for each patient */
select patient, DATE(datetime) as dateInfo,HOUR(datetime) as hourInfo, avg(skin_temp) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and skin_temp >0 Group by HOUR(datetime),DATE(datetime),patient order by patient,DATE(datetime),HOUR(datetime);

/* Query 2: Average skin temp for each day for each patient */
select patient, DATE(datetime) as dateInfo,avg(skin_temp) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and skin_temp >0 Group by DATE(datetime),patient order by patient,DATE(datetime);

/* Query 3: Average heart rate for each hour recorded of each day for each patient */
select patient, DATE(datetime) as dateInfo,HOUR(datetime) as hourInfo, avg(heartrate) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and heartrate >0 Group by HOUR(datetime),DATE(datetime),patient order by patient,DATE(datetime),HOUR(datetime);

/* Query 4: Average heart rate for each day for each patient */
select patient, DATE(datetime) as dateInfo,avg(heartrate) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and heartrate >0 Group by DATE(datetime),patient order by patient,DATE(datetime);

/* Query 5: Get each Patient, Start date, end date, total days in study */
select patient, MAX(DATE(datetime)) as endDate, MIN(DATE(datetime)) as startDate, DATEDIFF(MAX(DATE(datetime)), MIN(DATE(datetime))) as totalDays from sluWatch where patient in (select Distinct Patient from sluWatch) group by patient;

/* Query 6: Get SluWatchStats (neg_avg, pos-avg, impulsivity_avg, cigs, drinks) for all patients across the study time */
select patient, avg(neg_avg) as negAvg, avg(pos_avg) as posAvg, avg(impulsivity_avg) as impulsivityAvg, MAX(number_of_cigarettes) as numberCigs, MAX(number_of_drinks) as numberDrinks from sluWatchStats where patient IN ( select distinct patient from sluWatchStats) group by patient;

/* Query 7: Get SluWatchStats (neg_avg, pos-avg, impulsivity_avg) for all patients daily */
select cast(patient as unsigned) as userInfo, DATE_FORMAT(STR_TO_DATE(date, '%e/%c/%Y'), '%Y-%m-%d ') as dateInfo, neg_avg as negAvg, pos_avg as posAvg, impulsivity_avg as impulsivityAvg from sluWatchStats group by patient, dateInfo, neg_avg, pos_avg, impulsivity_avg;

/* Query 8: Average GSR for each hour recorded of each day for each patient */
select patient, DATE(datetime) as dateInfo,HOUR(datetime) as hourInfo, avg(gsr) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and gsr >0 Group by HOUR(datetime),DATE(datetime),patient order by patient,DATE(datetime),HOUR(datetime);

/* Query 9: Average GSR for each day for each patient */
select patient, DATE(datetime) as dateInfo,avg(gsr) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and gsr>0 Group by DATE(datetime),patient order by patient,DATE(datetime);
