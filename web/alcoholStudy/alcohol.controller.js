(function(){
   'use strict';
   /** Controller for the whole SLU WATCH page **/
   angular.module('researchApp').controller('AlcoholController',AlcoholController);
   AlcoholController.$inject = ['$scope','$rootScope','$http','$window','$location','LoginService','graphService','alcoholStudyAPI'];

   function AlcoholController(ngScope,ngRootScope,$http,window,location,LoginService,graphService,alcoholStudyAPI){

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

      	}); //END OF .then of API CALL

      } //END OF initAlcoholController function


   	  initAlcoholController();

   }

})();	