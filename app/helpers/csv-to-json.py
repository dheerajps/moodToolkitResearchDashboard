import pandas as pd
import numpy as np
import json

# Utility script to read in csv and convert to json format.

fin = 'NIMH_data/basic_stats.csv'
fout = 'basic_stats.json'

df1 = pd.read_csv(fin)
headers = list(df1.columns.values)


patients = {}
for patient in df1.itertuples():
   patient_info = {}

   for header, column in zip(headers[1:], patient[2:]):
      if pd.isnull(column):
         patient_info[header] = 0.0
      else:
         patient_info[header] = column

   patients[patient[1]] = patient_info



with open(fout, 'w') as jsonfile:
   jsonfile.write(json.dumps(patients))

