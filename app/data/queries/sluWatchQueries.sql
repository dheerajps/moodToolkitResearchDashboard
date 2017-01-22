/* SLU WATCH DATA QUERIES */

/* Query 1: Average skin temp for each hour recorded of each day for each patient */

select patient,DATE(datetime), HOUR(datetime), avg(skin_temp) from sluWatch where patient IN (select DISTINCT patient from sluWatch) and `skin_temp` >0 Group by HOUR(datetime),DATE(datetime),patient order by patient,DATE(datetime), HOUR(datetime);