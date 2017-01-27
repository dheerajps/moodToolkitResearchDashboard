# researchDash

########## To Create userInfo Table instructions
--Start mysql server: `mysql.server start`
	replace dbconfig credentials with your information
--Run this query in your DB console first:
	`create table userInfo ( ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, USERNAME varchar(30) NOT NULL , PASSWORD CHAR(128) NOT NULL, SALT varchar(64) NOT NULL)`
--Now register with username and password and then Login


########## Data Ingestion:
1) Run python script to convert csv to database:
Be sure to add your password and user cradentials
 ` cd app/helpers/`:

Import each study into mySQL using the following commands:

NIMH Data:

`python csv2mysql.py  --table nimhTest --database test --user root --password  --host localhost ../data/NIMH_data/formatted2/NIMH_formatted_dbschema.csv`

NIMH Summary stats:

`python csv2mysql.py  --table nimhTest --database test --user root --password  --host localhost ../data/NIMH_data/stats.csv`

SLU WATCH Data:
`python csv2mysql.py --table sluWatch --database test --user root --password "" --host localhost ../data/SLU_data/allpatients.csv`

SLU WATCH DATA Stats:
`python csv2mysql.py --table sluWatchStats --database test --user root --password "" --host localhost ../data/SLU_data/SLU_WATCH_stats.csv`

########## Server start instructions
- To run php server: `sudo php -S 127.0.0.1:8080 filename.php`

`sudo php -S 127.0.0.1:8088 /app/helpers/loginHelper.php`
`sudo php -S 127.0.0.1:8086 /app/helpers/registerHelper.php`
`sudo php -S 127.0.0.1:8090 /app/studies/sluWatchStudy.php`
`sudo php -S 127.0.0.1:8080 app/studies/nimhStudy.php`


