# researchDash


# Data ingestion:
1) Run python script to convert csv to database located in `app/helpers/`:
Be sure to add your password and user cradentials

NIMH Data:
`python csv2mysql.py  --table nimhTest --database test --user root --password  --host localhost ..helpers/NIMH_data/formatted2/NIMH_formatted_dbschema.csv`
NIMH Summary stats:
`python csv2mysql.py  --table nimhTest --database test --user root --password  --host localhost ..helpers/NIMH_data/stats.csv`

# Server start instructions
- To run php server: `sudo php -S 127.0.0.1:8080`
- Start mysql server `mysql.server start`
- replace dbconfig cradentials with your information