var users = []
var days_in_study = []
var surveys_complete = []
var total_mood_changes = []
var neg_mood_changes = []
var pos_mood_changes = []
var sum_total_changes = []
var sum_positive_changes = []
var sum_negative_changes = []
var study_data;

function getTotalSurveyCount(){
   survey_count = 0;
   for (i in surveys_complete){
      survey_count += surveys_complete[i];
   }
   return survey_count;
}

function getNIMHData() {
   var local_url = "http://127.0.0.1:8080/";

   var survey_data = $.ajax({
      type: 'GET',
      url: local_url + 'app/studies/nimhStudy.php',
      data: "",
      async: false,
      dataType: 'json',
      success: function(data) {
         console.log(data);
         sum_total_changes.push(parseInt(data["total_mood_changes"]));
         sum_positive_changes.push(parseInt(data["positive_changes"]));
         sum_negative_changes.push(parseInt(data["negative_changes"]));
         for (i in data["participants"]) {
            users.push("User " + data["participants"][i]["user"]);
            surveys_complete.push(data["participants"][i]["survey-count"]);
            days_in_study.push(data["participants"][i]["day-count"]);
            total_mood_changes.push(parseInt(data["participants"][i]["total_mood_changes"]));
            neg_mood_changes.push(parseInt(data["participants"][i]["negative_changes"]));
            pos_mood_changes.push(parseInt(data["participants"][i]["positive_changes"]));
         }
         study_data = data;
      },
      error: function(xhr, ajaxOptions, thrownError) {
         console.dir(thrownError);
         console.dir(xhr);
         console.dir(ajaxOptions);
      }
   });
}

getNIMHData();
$(document).ready(function(){

var missed_surveys_val = study_data["missed_surveys"];
$('.missed').append(missed_surveys_val);

function averageCompliance(){
 avg=0;
  for (i in study_data["participants"]) {
    avg+= study_data["participants"][i]["compliance"];
  }
  return avg/i;
}

var avg_compliance=averageCompliance();
$('.compliance').append(avg_compliance.toFixed(2));

var total_surveys_complete = getTotalSurveyCount();
$('.surveys').append(total_surveys_complete);

var total_days = study_data["active_days"];
$('.days').append(total_days);
});
$(function() {
   Highcharts.setOptions({
      colors: ['#FF9655', '#adfc71', '#dd616e', '#454545', '#b3aee5', '#64E572', '#FFF263', '#66FFCC', '#51b93e']
   });

   $('#total-mood').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Overall Moodchange Data'
        },

        xAxis: {
            categories: ['Participants'],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Changes'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y: .1f} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Total',
            data: sum_total_changes,
            color: Highcharts.getOptions().colors[3]

        }, {
            name: 'Positive',
            color: Highcharts.getOptions().colors[7],
            data: sum_positive_changes

        }, {
            name: 'Negative',
            color: Highcharts.getOptions().colors[2],
            data: sum_negative_changes

        }]
   });
});

$(function() {
   Highcharts.setOptions({
      colors: ['#FF9655', '#adfc71', '#dd616e', '#454545', '#b3aee5', '#64E572', '#FFF263', '#66FFCC', '#51b93e']
    });
   $('#days-surveys').highcharts({
      chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Days in Study and Surveys Complete'
        },
        xAxis: [{
            categories: users,
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value} Days',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            },
            title: {
                text: 'Days in Study',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'Surveys Complete',
                style: {
                    color: Highcharts.getOptions().colors[9]
                }
            },
            labels: {
                format: '{value} Surveys',
                style: {
                    color: Highcharts.getOptions().colors[9]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 40,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: 'Surveys',
            type: 'column',
            yAxis: 1,
            data: surveys_complete,
            tooltip: {
                valueSuffix: ' surveys'
            },
            color: Highcharts.getOptions().colors[3]

        }, {
            name: 'Days in Study',
            type: 'spline',
            data: days_in_study,
            tooltip: {
                valueSuffix: ' days'
            },
            color: Highcharts.getOptions().colors[9]
        }]
   });
});

$(function () {
    $("#mood-changes").highcharts({
      chart: {
            type: 'column'
        },
        title: {
            text: 'Positive and Negative Mood Changes Across Participants'
        },
        xAxis: {
            categories: users
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Number of changes'
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    'Total: ' + this.point.stackTotal;
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'Total Changes',
            color: Highcharts.getOptions().colors[3],
            data: total_mood_changes,
            stack: 'male'
        }, {
            name: 'Positive Changes',
            color: Highcharts.getOptions().colors[7],
            data: pos_mood_changes,
            stack: 'female'
        }, {
            name: 'Negative Changes',
            color: Highcharts.getOptions().colors[2],
            data: neg_mood_changes,
            stack: 'female'
        }]
    });
});


$(function() {
   Highcharts.setOptions({
      colors: ['#FF9655', '#adfc71', '#dd616e', '#454545', '#b3aee5', '#64E572', '#FFF263', '#66FFCC', '#51b93e','#7CB9E8', '#B284BE', '#C9FFE5']
    });
   $("#neg-mood-breakdown").highcharts({
      chart: {
         plotBackgroundColor: null,
         plotBorderWidth: null,
         plotShadow: false,
         type: 'pie'
      },
      title: {
         text: 'Negative Mood Change Triggers'
      },
      tooltip: {
         borderColor: null,
         pointFormat: '{series.data.name} {point.percentage:.1f}%</b>'
      },
      plotOptions: {
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
               enabled: false
            }
         }
      },
      series: [{
         name: 'Negative Triggers',
         colorByPoint: true,
         data: [{
            name: 'Argument or Conflict',
            color: Highcharts.getOptions().colors[0],
            y: parseInt(study_data['neg_argument_or_conflict'])
         }, {
            name: 'Felt Rejected',
            color: Highcharts.getOptions().colors[1],
            y: parseInt(study_data['neg_felt_rejected'])
         }, {
            name: 'Lack of Sleep',
            color: Highcharts.getOptions().colors[2],
            y: parseInt(study_data['neg_lack_of_sleep'])
         }, {
            name: 'No trigger',
            color: Highcharts.getOptions().colors[3],
            y: parseInt(study_data['neg_no_trigger'])
         }, {
            name: 'Other',
            color: Highcharts.getOptions().colors[4],
            y: parseInt(study_data['neg_other'])
         }, {
            name: 'Pain Or Bodiy Discomfort',
            color: Highcharts.getOptions().colors[5],
            y: parseInt(study_data['neg_pain_or_bodiy_discomfort'])
         },{
            name: 'Problem at Work or School',
            color: Highcharts.getOptions().colors[6],
            y: parseInt(study_data['neg_problem_at_work_or_school'])
         }, {
            name: 'Received Bad News',
            color: Highcharts.getOptions().colors[7],
            y: parseInt(study_data['neg_received_bad_news'])
         },{
            name: 'Stress',
            color: Highcharts.getOptions().colors[8],
            y: parseInt(study_data['neg_stress'])
         },{
            name: 'Upset/Mad at Myself',
            color: Highcharts.getOptions().colors[9],
            y: parseInt(study_data['neg_upset_mad_at_myself'])
         }, {
            name: 'Used Alcohol',
            color: Highcharts.getOptions().colors[10],
            y: parseInt(study_data['neg_used_alcohol'])
         },{
            name: 'Used Drugs',
            color: Highcharts.getOptions().colors[11],
            y: parseInt(study_data['neg_used_drugs'])
         }, {
            name: 'Used Prescribed Medications',
            color: Highcharts.getOptions().colors[12],
            y: parseInt(study_data['neg_used_prescribed_medications'])
         }]
      }]
   });
});

$(function() {
   $("#pos-mood-breakdown").highcharts({
      chart: {
         plotBackgroundColor: null,
         plotBorderWidth: null,
         plotShadow: false,
         type: 'pie'
      },
      title: {
         text: 'Positive Mood Change Triggers'
      },
      tooltip: {
         pointFormat: '{series.data.name} {point.percentage:.1f}%</b>'
      },
      plotOptions: {
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
               enabled: false
            },
            showInLegend: false
         }
      },
      series: [{
         name: 'Positive Triggers',
         colorByPoint: true,
         data: [{
            name: 'Exercised',
            color: Highcharts.getOptions().colors[0],
            y: parseInt(study_data['pos_exercised'])
         },{
            name: 'Felt Accepted and Supported',
            color: Highcharts.getOptions().colors[2],
            y: parseInt(study_data['pos_felt_accepted_and_supported'])
         }, {
            name: 'Had Nice Day or Evening',
            color: Highcharts.getOptions().colors[3],
            y: parseInt(study_data['pos_had_nice_day_or_evening'])
         }, {
            name: 'Had Sex',
            color: Highcharts.getOptions().colors[4],
            y: parseInt(study_data['pos_had_sex'])
         }, {
            name: 'No Trigger',
            color: Highcharts.getOptions().colors[5],
            y: parseInt(study_data['pos_no_trigger'])
         },{
            name: 'Other',
            color: Highcharts.getOptions().colors[6],
            y: parseInt(study_data['pos_other'])
         }, {
            name: 'Received Good News',
            color: Highcharts.getOptions().colors[7],
            y: parseInt(study_data['pos_received_good_news'])
         },{
            name: 'Someone Complemented Me',
            color: Highcharts.getOptions().colors[8],
            y: parseInt(study_data['pos_someone_complimented_me'])
         },{
            name: 'Spent Time with Someone Close',
            color: Highcharts.getOptions().colors[9],
            y: parseInt(study_data['pos_spent_time_with_someone_close'])
         }, {
            name: 'Used Alcohol',
            color: Highcharts.getOptions().colors[10],
            y: parseInt(study_data['pos_used_alcohol'])
         },{
            name: 'Used Drugs',
            color: Highcharts.getOptions().colors[11],
            y: parseInt(study_data['pos_used_drugs'])
         }, {
            name: 'Used Prescribed Medications',
            color: Highcharts.getOptions().colors[12],
            y: parseInt(study_data['pos_used_prescribed_medications'])
         }]
      }]
   });
});

