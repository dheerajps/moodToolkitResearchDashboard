var users = []
var days_in_study = []
var surveys_complete = []

function getNIMHData() {
   var local_url = "http://127.0.0.1:8080/";

   var survey_data = $.ajax({
      type: 'GET',
      url: local_url + 'app/studies/nimhStudy.php',
      data: "",
      async: false,
      dataType: 'json',
      success: function(data) {
         for (i in data) {
            users.push("User " + data[i]["user"]);
            surveys_complete.push(data[i]["survey-count"]);
            days_in_study.push(data[i]["day-count"]);
         }
      },
      error: function(xhr, ajaxOptions, thrownError) {
         console.dir(thrownError);
         console.dir(xhr);
         console.dir(ajaxOptions);
      }
   });
}
getNIMHData();
$(function() {
   Highcharts.setOptions({
      colors: ['#FF9655', '#adfc71', '#dd616e', '#454545', '#b3aee5', '#64E572', '#FFF263', '#6AF9C4']
   });

   $('#surveys').highcharts({
      chart: {
         type: 'column'
      },
      title: {
         text: 'Surveys Complete'
      },
      xAxis: {
         categories: users,
         crosshair: true
      },
      yAxis: {
         min: 0,
         title: {
            text: 'Number'
         }
      },
      tooltip: {
         headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
         pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
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
         name: 'surveys complete ',
         color: Highcharts.getOptions().colors[2],
         data: surveys_complete
      }]
   });
});

$(function() {
   $('#days').highcharts({
      chart: {
         type: 'column'
      },
      title: {
         text: 'Number of Days in Study'
      },
      xAxis: {
         categories: users,
         title: {
            text: null
         }
      },
      yAxis: {
         min: 0,
         title: {
            text: 'Days',
            align: 'high'
         },
         labels: {
            overflow: 'justify'
         }
      },
      tooltip: {
         valueSuffix: ' days'
      },
      plotOptions: {
         bar: {
            dataLabels: {
               enabled: true
            }
         }
      },
      credits: {
         enabled: false
      },
      series: [{
         name: 'days',
         color: Highcharts.getOptions().colors[3],
         data: days_in_study
      }]
   });
});
