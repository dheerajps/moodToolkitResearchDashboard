/* SLU WATCH DATA QUERIES */

/* Query 1: Average skin temp for each hour recorded of each day of every week for each patient */

select patient, WEEK(datetime) as weekInfo, DATE(datetime) as dateInfo, HOUR(datetime) as hourInfo, avg(skin_temp) as avg from sluWatch where patient IN (select DISTINCT patient from sluWatch) and skin_temp >0 Group by HOUR(datetime),DATE(datetime),WEEK(datetime),patient order by patient,WEEK(datetime),DATE(datetime), HOUR(datetime);