import pandas as pd
import numpy as np
import glob, os


def format(survey_directory):

    survey_frame = pd.read_csv(survey_directory)
    survey_frame.drop(['ScheculedTS','Reminder1','Reminder2','Reminder3', 'StudayDay'], axis=1, inplace=True)

    survey_frame = survey_frame.rename(columns={
                                    'EndTS': 'SurveyEnd',
                                    'StartTS': 'SurveyStart',
                                    'Type':'SurveyType',
                                    'Type.1':'SurveyLabel'})

    survey_frame = survey_frame[(survey_frame.SurveyEnd.notnull())]
    return survey_frame

survey_files = glob.glob('*.csv')
for ix, survey_file in enumerate(survey_files):
    try:
        number = survey_file.split(".")[0]
        formatdf = format(survey_file)
        out_string = str(number) + '_formatted.csv'
        subdirectory = 'formatted/'
        try:
            os.mkdir(subdirectory)
        except Exception:
            pass

        formatdf.to_csv(os.path.join(subdirectory, out_string), index=False)

    except Exception, e:
        print e
        print str(number)+" "+ str(ix)
        pass

alldf = pd.concat((pd.read_csv(f) for f in glob.glob('formatted/*[0-9]*.csv')))
print alldf.Patient.unique()
alldf.to_csv('formatted/formatted_complete.csv', index = False)

