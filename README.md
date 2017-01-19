# researchDash


# Data ingestion:
1) Run python script to convert csv to database located in `app/helpers/`:
Be sure to add your password and user cradentials

NIMH Data:
`python csv2mysql.py  --table nimhTest --database test --user root --password  --host localhost ..helpers/NIMH_data/formatted2/NIMH_formatted_dbschema.csv`
NIMH Summary stats:
`python csv2mysql.py  --table nimhTest --database test --user root --password  --host localhost ..helpers/NIMH_data/stats.csv`
SLU WATCH Data:
'python csv2mysql.py --table sluWatch --database test --user root --password "" --host localhost ../allpatients.csv'

# Server start instructions
- To run php server: `sudo php -S 127.0.0.1:8080 filename.php`
- Start mysql server `mysql.server start`
- replace dbconfig cradentials with your information

- 8080: nimhStudy.php
- 8088: loginHelper.php
- 8089: registerHelper.php

#To Create userInfo Table instructions
Run this query in your DB console first:
create table userInfo ( ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, USERNAME varchar(30) NOT NULL , PASSWORD CHAR(128) NOT NULL, SALT varchar(64) NOT NULL)
Now register with username and password and then Login

