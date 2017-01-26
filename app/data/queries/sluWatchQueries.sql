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