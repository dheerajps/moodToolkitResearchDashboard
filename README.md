# researchDash
A Data Analaytical Dashboard for research studies done by Deapartment of Computer Science and Department of Psychology. This web app provides analytical view models of different studies undertaken.
Using PHP, MySql, AngualrJs, HTML, CSS and HighChart.js as the chart provider.

# Data ingestion:
1) Run python script to convert csv to database located in `app/helpers/`:
Be sure to add your password and user cradentials

NIMH Data:
`python csv2mysql.py  --table nimhTest --database test --user root --password  --host localhost ..helpers/NIMH_data/formatted2/NIMH_formatted_dbschema.csv`
NIMH Summary stats:
`python csv2mysql.py  --table nimhTest --database test --user root --password  --host localhost ..helpers/NIMH_data/stats.csv`

# Server start instructions( as of now done locally)
- To run php server: `sudo php -S 127.0.0.1:8080`
- Start mysql server `mysql.server start`
- replace dbconfig cradentials with your information
