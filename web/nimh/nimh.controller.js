(function(){
   
   /** Controller for the whole NIMH page **/
   angular.module('researchApp').controller('NimhController',NimhController);
   NimhController.$inject = ['$scope','$rootScope','$http','nimhAPI','$window','$location','LoginService','ColorConstants','graphService','AggregateService'];

   function NimhController(ngScope,ngRootScope,$http,nimhAPI,window,location,LoginService,ColorConstants,graphService,AggregateService){

      var vm = this;
      initNIMHController();
      vm.takeBack = takeBack;


      vm.initiateLogOut =function(){

        vm.message = "You have logged out Successfully!";
        LoginService.clearCredentials();
        Materialize.toast(vm.message, 7000, 'rounded');
        location.path('/login');
      }
      function takeBack(){
        if(!vm.showUserPageFlag){
           window.history.back();
          }
        else{
          vm.showUserPageFlag=false;
          vm.showOverviewPageFlag=true;
        }
      }
      function initNIMHController(){
         
         setTimeout(function() {$(".dropdown-button").dropdown();
          }, 10);

          nimhAPI.getNIMHData().then(function (d){

             vm.nimhData = d.data;
             
             vm.nimhData.users = vm.nimhData.participants;
             vm.showUserPageFlag =false;
             vm.showOverviewPageFlag =true;
             vm.userSelected = null;
             

             vm.findAvgCompliance = AggregateService.getAverageCompliance(vm.nimhData.users);

             vm.findTotal = function(property){
               return AggregateService.getTotalValue(vm.nimhData.users,property);
             }
             
             //Colors for the graph
             vm.colors = ['#FF9655', '#adfc71', '#dd616e', '#454545', '#b3aee5', '#64E572', '#FFF263', '#66FFCC', '#51b93e'];

             //Data for the graphs in desired format
             vm.users = [];
             vm.users.daysComplete = [];
             vm.users.surveysComplete = [];
             vm.users.totalMoodChanges = [];
             vm.users.positiveMoodChanges = [];
             vm.users.negativeMoodChanges = [];

             angular.forEach(vm.nimhData.users, function(value, key) {
                  vm.users.push('USER ' + value.user);
                  vm.users.daysComplete.push(value['day-count']);
                  vm.users.surveysComplete.push(value['survey-count']);
                  vm.users.totalMoodChanges.push(value['total_mood_changes']);
                  vm.users.positiveMoodChanges.push(value['positive_changes']);
                  vm.users.negativeMoodChanges.push(value['negative_changes']);
             });

             vm.totalOverallMoodChanges = parseInt(vm.findTotal('total_mood_changes'));
             vm.totalPositiveChanges = parseInt(vm.findTotal('positive_changes'));
             vm.totalNegativeChanges = parseInt(vm.findTotal('negative_changes'));


             vm.navigateToUserPage = function(userId){
            
              vm.showOverviewPageFlag = false;
              vm.showUserPageFlag=true;
              window.scrollTo(0,0);
              vm.currentUser=userId;
              vm.drawUserPageGraphs(vm.currentUser);
              

             }
             /** Any graphs to be drawn on the USER view of NIMH page **/
             vm.drawUserPageGraphs = function(currentUser){

                const total = "total_mood_changes";
                const positive = "positive_changes";
                const negative = "negative_changes";

                vm.totalUserMoodBreakdownGraph = graphService.getUserTotalMoodBreakdownGraph(currentUser, total, positive, negative); //end of user-mood-changes breakdown graph
             }
             
             /** All the graphs on the OVERVIEW page **/
            vm.daysSurveysGraph = graphService.getDaysInStudyGraph(vm.users, vm.users.daysComplete, vm.users.surveysComplete); //end of days-surveys graphs

            vm.moodChangesGraph = graphService.getMoodChangesGraph(vm.users, vm.users.totalMoodChanges, vm.users.positiveMoodChanges, vm.users.negativeMoodChanges);//end of mood-changes graph

            vm.totalMoodBreakdownGraph = graphService.getTotalMoodBreakdownGraph(vm.totalOverallMoodChanges, vm.totalPositiveChanges, vm.totalNegativeChanges);//end of mood-changes breakdown graph

            vm.negativeMoodBreakdownGraph = {

               options:{
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
                           enabled: true
                        }
                     }
                  }
               },
               credits: {
                  enabled: false
               },
               series: [{
                  name: 'Negative Triggers',
                  colorByPoint: true,
                  data: [{
                     name: 'Argument or Conflict',
                     color: vm.colors[0],
                     y: parseInt(vm.nimhData['neg_argument_or_conflict'])
                  }, {
                     name: 'Felt Rejected',
                     color: vm.colors[1],
                     y: parseInt(vm.nimhData['neg_felt_rejected'])
                  }, {
                     name: 'Lack of Sleep',
                     color: vm.colors[2],
                     y: parseInt(vm.nimhData['neg_lack_of_sleep'])
                  }, {
                     name: 'No trigger',
                     color: vm.colors[3],
                     y: parseInt(vm.nimhData['neg_no_trigger'])
                  }, {
                     name: 'Other',
                     color: vm.colors[4],
                     y: parseInt(vm.nimhData['neg_other'])
                  }, {
                     name: 'Pain Or Bodiy Discomfort',
                     color: vm.colors[5],
                     y: parseInt(vm.nimhData['neg_pain_or_bodiy_discomfort'])
                  },{
                     name: 'Problem at Work or School',
                     color: vm.colors[6],
                     y: parseInt(vm.nimhData['neg_problem_at_work_or_school'])
                  }, {
                     name: 'Received Bad News',
                     color: vm.colors[7],
                     y: parseInt(vm.nimhData['neg_received_bad_news'])
                  },{
                     name: 'Stress',
                     color: vm.colors[8],
                     y: parseInt(vm.nimhData['neg_stress'])
                  },{
                     name: 'Upset/Mad at Myself',
                     color: vm.colors[9],
                     y: parseInt(vm.nimhData['neg_upset_mad_at_myself'])
                  }, {
                     name: 'Used Alcohol',
                     color: vm.colors[10],
                     y: parseInt(vm.nimhData['neg_used_alcohol'])
                  },{
                     name: 'Used Drugs',
                     color: vm.colors[11],
                     y: parseInt(vm.nimhData['neg_used_drugs'])
                  }, {
                     name: 'Used Prescribed Medications',
                     color: vm.colors[12],
                     y: parseInt(vm.nimhData['neg_used_prescribed_medications'])
                  }]
               }]
               
            }// end of neg-mood breakdown graph

            vm.positiveMoodBreakdownGraph = {

               options:{
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
                        showInLegend: true
                     }
                  }
               },
               credits: {
                  enabled: false
               },
               series: [{
                  name: 'Positive Triggers',
                  colorByPoint: true,
                  data: [{
                     name: 'Exercised',
                     color: vm.colors[0],
                     y: parseInt(vm.nimhData['pos_exercised'])
                  },{
                     name: 'Felt Accepted and Supported',
                     color: vm.colors[2],
                     y: parseInt(vm.nimhData['pos_felt_accepted_and_supported'])
                  }, {
                     name: 'Had Nice Day or Evening',
                     color: vm.colors[3],
                     y: parseInt(vm.nimhData['pos_had_nice_day_or_evening'])
                  }, {
                     name: 'Had Sex',
                     color: vm.colors[4],
                     y: parseInt(vm.nimhData['pos_had_sex'])
                  }, {
                     name: 'No Trigger',
                     color: vm.colors[5],
                     y: parseInt(vm.nimhData['pos_no_trigger'])
                  },{
                     name: 'Other',
                     color: vm.colors[6],
                     y: parseInt(vm.nimhData['pos_other'])
                  }, {
                     name: 'Received Good News',
                     color: vm.colors[7],
                     y: parseInt(vm.nimhData['pos_received_good_news'])
                  },{
                     name: 'Someone Complemented Me',
                     color: vm.colors[8],
                     y: parseInt(vm.nimhData['pos_someone_complimented_me'])
                  },{
                     name: 'Spent Time with Someone Close',
                     color: vm.colors[9],
                     y: parseInt(vm.nimhData['pos_spent_time_with_someone_close'])
                  }, {
                     name: 'Used Alcohol',
                     color: vm.colors[10],
                     y: parseInt(vm.nimhData['pos_used_alcohol'])
                  },{
                     name: 'Used Drugs',
                     color: vm.colors[11],
                     y: parseInt(vm.nimhData['pos_used_drugs'])
                  }, {
                     name: 'Used Prescribed Medications',
                     color: vm.colors[12],
                     y: parseInt(vm.nimhData['pos_used_prescribed_medications'])
                  }]
               }]

            } //end of pos-mood breakdown graph

         }); // end of .then call for the service

      } //end of initNIMHController

   }//end of controller


}) ();