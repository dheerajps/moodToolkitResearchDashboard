(function(){
   'use strict';
   /** Controller for the whole SLU WATCH page **/
   angular.module('researchApp').controller('SluController',SluController);
   SluController.$inject = ['$scope','$rootScope','$http','$window','$location','LoginService','sluWatchAPI'];

   function SluController(ngScope,ngRootScope,$http,window,location,LoginService,sluWatchAPI){

      var vm = this;
      
      vm.takeBack = takeBack;
      vm.initSluController = initSluController;
      vm.showOverviewPageFlag = true;
      vm.showUserPageFlag = false;

      /** Initiate LogOut **/
      vm.initiateLogOut =function(){

        vm.message = "You have logged out Successfully!";
        LoginService.clearCredentials();
        Materialize.toast(vm.message, 7000, 'rounded');
        location.path('/login');
      }
      /** Take back -1 history **/
      function takeBack(){
        if(!vm.showUserPageFlag){
           window.history.back();
          }
        else{
          vm.showUserPageFlag=false;
          vm.showOverviewPageFlag=true;
        }
      }

      /** Sets flags and initiates route to SLU user view **/

      vm.navigateToUserPage = function(userId){
          vm.showOverviewPageFlag = false;
          vm.showUserPageFlag=true;
          window.scrollTo(0,0);
          vm.currentUser=userId;
          //vm.drawUserPageGraphs(vm.currentUser);
          console.log(vm.currentUser);
      }


      function initSluController(){

        console.log("in slu");
        sluWatchAPI.getsluWatchData().then(function (response){
          console.log(response.data);

          vm.sluData = response.data;

          vm.sluUsers = vm.sluData["studyStats"];

        });
      }

      initSluController();
    }

})();