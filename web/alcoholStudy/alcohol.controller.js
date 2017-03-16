(function(){
   'use strict';
   /** Controller for the whole SLU WATCH page **/
   angular.module('researchApp').controller('AlcoholController',AlcoholController);
   AlcoholController.$inject = ['$scope','$rootScope','$http','$window','$location','LoginService','graphService','alcoholStudyAPI','ColorConstants','AggregateService'];

   function AlcoholController(ngScope,ngRootScope,$http,window,location,LoginService,graphService,alcoholStudyAPI,ColorConstants,AggregateService){

   	var vm = this;

      vm.takeBack = takeBack;
      vm.initAlcoholController = initAlcoholController;
      vm.showOverviewPageFlag = true;
      vm.showUserPageFlag = false;
      
      /** Initiate LogOut **/
      vm.initiateLogOut =function(){

        vm.message = "You have logged out Successfully!";
        LoginService.clearCredentials();
        Materialize.toast(vm.message, 7000, 'rounded');
        location.path('/login');

      }
      /** Take back to previous window **/
      function takeBack(){

        if(!vm.showUserPageFlag){
           window.history.back();
        }
        else{
          vm.showUserPageFlag=false;
          initAlcoholController();
          vm.showOverviewPageFlag=true;
        }

      }

      function initAlcoholController(){
      	setTimeout(function() {$(".dropdown-button").dropdown();
		}, 10);
      	
      	alcoholStudyAPI.getAlcoholStudyData().then(function (response){

      		//console.log(response.data);

      		/** GET THE RESPONSE DATA AND STORE IT **/
            vm.alcoholData = response.data;
            
            vm.alcoholData.moodStats = vm.alcoholData["totalMoodStats"]["0"];
            vm.alcoholData.users = vm.alcoholData["userStudyStats"];

            vm.users = [];
            vm.totalDaysInStudy = [];
            vm.completedSurveys = [];
            vm.missedSurveys = [];
            vm.totalSurveys = [];
            vm.totalMoodChanges = [];
            vm.positiveMoodChanges = [];
            vm.negativeMoodChanges = [];

            angular.forEach(vm.alcoholData.users, function(value, key){

            	vm.users.push('USER ' + value.user);
            	vm.totalDaysInStudy.push(value.totalDays);
            	vm.completedSurveys.push(value.completedSurveys);
            	vm.missedSurveys.push(value.missedSurveys);
            	vm.totalSurveys.push(value.totalSurveys);
            	vm.totalMoodChanges.push(value.totalMoodChanges);
            	vm.positiveMoodChanges.push(value.posMoodChanges);
            	vm.negativeMoodChanges.push(value.negMoodChanges);

            }); //END OF FOR-LOOP
            

            console.log(vm.alcoholData.moodStats);
            vm.findAvgCompliance = AggregateService.getAverageCompliance(vm.alcoholData.users);

            vm.findTotal = function(property){
               return AggregateService.getTotalValue(vm.alcoholData.users , property);
            }


            vm.totalOverallMoodChanges = parseInt(vm.findTotal('totalMoodChanges'));
		    vm.totalPositiveChanges = parseInt(vm.findTotal('posMoodChanges'));
		    vm.totalNegativeChanges = parseInt(vm.findTotal('negMoodChanges'));


            /** Sets flags and initiates route to Alocohol user view **/

            vm.navigateToUserPage = function(userId){

                vm.showOverviewPageFlag = false;
                vm.showUserPageFlag=true;
                window.scrollTo(0,0);
                vm.currentUser=userId;
                vm.drawUserPageGraphs(vm.currentUser);
               // console.log(vm.currentUser);
            }
            /** Any graphs to be drawn on the USER view of NIMH page **/
             vm.drawUserPageGraphs = function(currentUser){

                const total = "totalMoodChanges";
                const positive = "posMoodChanges";
                const negative = "negMoodChanges";

                vm.totalUserMoodBreakdownGraph = graphService.getUserTotalMoodBreakdownGraph(currentUser, total, positive, negative); //end of user-mood-changes breakdown graph
            }


            /* GRAPHS FOR THE OVERVIEW PAGE GOES HERE */
            vm.daysSurveysGraph = graphService.getDaysInStudyGraph(vm.users, vm.totalDaysInStudy, vm.completedSurveys); //end of days-surveys graphs
            vm.moodChangesGraph = graphService.getMoodChangesGraph(vm.users, vm.totalMoodChanges, vm.positiveMoodChanges, vm.negativeMoodChanges); //end of moodChangesGraph
            vm.totalMoodBreakdownGraph = graphService.getTotalMoodBreakdownGraph(vm.totalOverallMoodChanges, vm.totalPositiveChanges, vm.totalNegativeChanges);//end of mood-changes breakdown graph
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
                     
                     y: parseInt(vm.alcoholData.moodStats['pos_exercised'])
                  },{
                     name: 'Felt Accepted and Supported',
                     
                     y: parseInt(vm.alcoholData.moodStats['pos_felt_accepted_and_supported'])
                  }, {
                     name: 'Had Nice Day or Evening',
                     
                     y: parseInt(vm.alcoholData.moodStats['pos_had_nice_day_or_evening'])
                  }, {
                     name: 'Had Sex',
                     
                     y: parseInt(vm.alcoholData.moodStats['pos_had_sex'])
                  }, {
                     name: 'No Trigger',
                     
                     y: parseInt(vm.alcoholData.moodStats['pos_no_trigger'])
                  },{
                     name: 'Other',
                     
                     y: parseInt(vm.alcoholData.moodStats['pos_other'])
                  }, {
                     name: 'Received Good News',
                     
                     y: parseInt(vm.alcoholData.moodStats['pos_received_good_news'])
                  },{
                     name: 'Someone Complemented Me',
                    
                     y: parseInt(vm.alcoholData.moodStats['pos_someone_complimented_me'])
                  },{
                     name: 'Spent Time with Someone Close',
                     
                     y: parseInt(vm.alcoholData.moodStats['pos_spent_time_with_someone_close'])
                  }, {
                     name: 'Used Alcohol',
                     
                     y: parseInt(vm.alcoholData.moodStats['pos_used_alcohol'])
                  },{
                     name: 'Used Drugs',
                    
                     y: parseInt(vm.alcoholData.moodStats['pos_used_drugs'])
                  }, {
                     name: 'Used Prescribed Medications',
                     
                     y: parseInt(vm.alcoholData.moodStats['pos_used_prescribed_medications'])
                  }]
               }]

            } //end of pos-mood breakdown graph


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
                     
                     y: parseInt(vm.alcoholData.moodStats['neg_argument_or_conflict'])
                  }, {
                     name: 'Felt Rejected',
                     
                     y: parseInt(vm.alcoholData.moodStats['neg_felt_rejected'])
                  }, {
                     name: 'Lack of Sleep',
                     
                     y: parseInt(vm.alcoholData.moodStats['neg_lack_of_sleep'])
                  }, {
                     name: 'No trigger',
                     
                     y: parseInt(vm.alcoholData.moodStats['neg_no_trigger'])
                  }, {
                     name: 'Other',
                     
                     y: parseInt(vm.alcoholData.moodStats['neg_other'])
                  }, {
                     name: 'Pain Or Bodily Discomfort',
                    
                     y: parseInt(vm.alcoholData.moodStats['neg_pain_or_bodiy_discomfort'])
                  },{
                     name: 'Problem at Work or School',
                    
                     y: parseInt(vm.alcoholData.moodStats['neg_problem_at_work_or_school'])
                  }, {
                     name: 'Received Bad News',
                     
                     y: parseInt(vm.alcoholData.moodStats['neg_received_bad_news'])
                  },{
                     name: 'Stress',
                     
                     y: parseInt(vm.alcoholData.moodStats['neg_stress'])
                  },{
                     name: 'Upset/Mad at Myself',
                     
                     y: parseInt(vm.alcoholData.moodStats['neg_upset_mad_at_myself'])
                  }, {
                     name: 'Used Alcohol',
                     
                     y: parseInt(vm.alcoholData.moodStats['neg_used_alcohol'])
                  },{
                     name: 'Used Drugs',
                     
                     y: parseInt(vm.alcoholData.moodStats['neg_used_drugs'])
                  }, {
                     name: 'Used Prescribed Medications',
                     
                     y: parseInt(vm.alcoholData.moodStats['neg_used_prescribed_medications'])
                  }]
               }]
               
            }// end of neg-mood breakdown graph

      	}); //END OF .then of API CALL

      } //END OF initAlcoholController function


   	  initAlcoholController();

   }

})();	