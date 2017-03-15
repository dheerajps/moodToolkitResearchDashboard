/** Custom Service to help highcharts config object, to be hsared for similar graphs across the studies **/
(function(){
   angular.module('researchApp').service('graphService',['$http', 'ColorConstants', function graphService($http, ColorConstants){


      return{

         getDaysInStudyGraph: getDaysInStudyGraph,
         getMoodChangesGraph: getMoodChangesGraph,
         getTotalMoodBreakdownGraph: getTotalMoodBreakdownGraph,
         getUserTotalMoodBreakdownGraph: getUserTotalMoodBreakdownGraph
      };


      function getDaysInStudyGraph(users, daysComplete, surveysComplete){

          daysSurveysGraph = {
               options: {

                  chart: {
                         zoomType: 'xy'
                  },
                  title: {
                          text: 'Days in Study and Surveys Complete'
                  },
                  xAxis: {
                           categories: users,
                           crosshair: true
                  },
                  yAxis: [{ // Primary yAxis
                     labels: {
                         format: '{value} Days',
                         style: {
                             color: ColorConstants.Colors['AppleGreen']
                         }
                     },
                     title: {
                         text: 'Days in Study',
                         style: {
                             color: ColorConstants.Colors['AppleGreen']
                         }
                     }
                  }, { // Secondary yAxis
                     title: {
                         text: 'Surveys Complete',
                         style: {
                             color: ColorConstants.Colors['Tundora']
                         }
                     },
                     labels: {
                         format: '{value} Surveys',
                         style: {
                             color: ColorConstants.Colors['Tundora']
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
                  backgroundColor: '#FFFFFF'
                  }
               },
               credits: {
                  enabled: false
               },
               series: [{
                  name: 'Surveys',
                  type: 'column',
                  yAxis: 1,
                  data: surveysComplete,
                  tooltip: {
                      valueSuffix: ' surveys'
                  },
                  color: ColorConstants.Colors['Tundora']

               }, {
                  name: 'Days in Study',
                  type: 'spline',
                  data: daysComplete,
                  tooltip: {
                      valueSuffix: ' days'
                  },
                  color: ColorConstants.Colors['AppleGreen']
               }]
            } //end of days-surveys graphs

            return daysSurveysGraph;

      }

      function getMoodChangesGraph(users, totalMoodChanges, positiveMoodChanges, negativeMoodChanges){

          moodChangesGraph = {
               options :{ 

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
                  }
               },

              credits: {
                  enabled: false
               },

              series: [{
                  name: 'Total Changes',
                  color: ColorConstants.Colors['Tundora'],
                  data:  totalMoodChanges,
                  stack: 'male'
              }, {
                  name: 'Positive Changes',
                  color: ColorConstants.Colors['AquaMarine'],
                  data: positiveMoodChanges,
                  stack: 'female'
              }, {
                  name: 'Negative Changes',
                  color: ColorConstants.Colors['Roman'],
                  data:  negativeMoodChanges,
                  stack: 'female'
              }]

          }//end of mood-changes graph

          return moodChangesGraph;
      }

      function getTotalMoodBreakdownGraph(totalOverallMoodChanges, totalPositiveChanges, totalNegativeChanges){

          totalMoodBreakdownGraph = {

            options:{

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
                 }
               },
               series: [{
                  name: 'Total Changes',
                  color: ColorConstants.Colors['Tundora'],
                  data: [totalOverallMoodChanges]
               }, {
                  name: 'Positive Changes',
                  color: ColorConstants.Colors['AquaMarine'],
                  data: [totalPositiveChanges]
               }, {
                  name: 'Negative Changes',
                  color: ColorConstants.Colors['Roman'],
                  data: [totalNegativeChanges]
               }],
               credits: {
                  enabled: false
               }

          }

          return totalMoodBreakdownGraph; //end of mood-changes breakdown graph
      }

      function getUserTotalMoodBreakdownGraph(userObj, total, positive, negative){

         totalUserMoodBreakdownGraph = {
            options:{

                chart: {
                   type: 'column'
               },
               title: {
                   text: 'Overall User Moodchange Data'
               },

               xAxis: {
                   categories: ["USER "+ userObj.user ],
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
               }
             },
             series: [{
                name: 'Total Changes',
                color: ColorConstants.Colors['Tundora'],
                data: [userObj[total]]
             }, {
                name: 'Positive Changes',
                color: ColorConstants.Colors['AquaMarine'],
                data: [userObj[positive]]
             }, {
                name: 'Negative Changes',
                color: ColorConstants.Colors['Roman'],
                data: [userObj[negative]]
             }],
             credits: {
                enabled: false
             }
         }
         return totalUserMoodBreakdownGraph;
      }

   }]);
}) ();