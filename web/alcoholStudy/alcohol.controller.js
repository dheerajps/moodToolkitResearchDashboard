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

      	alcoholStudyAPI.getAlcoholStudyData().then(function (response){

      		console.log(response.data);

      		/** GET THE RESPONSE DATA AND STORE IT **/
            vm.alcoholData = response.data;
            

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
            console.log(vm.totalSurveys);

            vm.findAvgCompliance = AggregateService.getAverageCompliance(vm.alcoholData.users);

            vm.findTotal = function(property){
               return AggregateService.getTotalValue(vm.alcoholData.users , property);
            }

            /** Sets flags and initiates route to Alocohol user view **/

            vm.navigateToUserPage = function(userId){

                vm.showOverviewPageFlag = false;
                vm.showUserPageFlag=true;
                window.scrollTo(0,0);
                vm.currentUser=userId;
                console.log(vm.currentUser);
            }
            /* GRAPHS FOR THE OVERVIEW PAGE GOES HERE */
            vm.daysSurveysGraph = graphService.getDaysInStudyGraph(vm.users, vm.totalDaysInStudy, vm.completedSurveys); //end of days-surveys graphs
            vm.moodChangesGraph = graphService.getMoodChangesGraph(vm.users, vm.totalMoodChanges, vm.positiveMoodChanges, vm.negativeMoodChanges); //end of moodChangesGraph


      	}); //END OF .then of API CALL

      } //END OF initAlcoholController function


   	  initAlcoholController();

   }

})();	