(function(){
   'use strict';
   /** Controller for the whole SLU WATCH page **/
   angular.module('researchApp').controller('AlcoholController',AlcoholController);
   AlcoholController.$inject = ['$scope','$rootScope','$http','$window','$location','LoginService','graphService','alcoholStudyAPI','ColorConstants','AggregateService'];

   function AlcoholController(ngScope,ngRootScope,$http,window,location,LoginService,graphService,alcoholStudyAPI,ColorConstants,'AggregateService'){

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

            angular.forEach(vm.alcoholData.users, function(value, key){

            	vm.users.push('USER ' + value.user);
            	vm.totalDaysInStudy.push(value.totalDays);
            	vm.completedSurveys.push(value.completedSurveys);
            	vm.missedSurveys.push(value.missedSurveys);
            	vm.totalSurveys.push(value.totalSurveys);
            	

            }); //END OF FOR-LOOP

            vm.findAvgCompliance = AggregateService.getAverageCompliance(vm.alcoholData.users);

      	}); //END OF .then of API CALL

      } //END OF initAlcoholController function


   	  initAlcoholController();

   }

})();	