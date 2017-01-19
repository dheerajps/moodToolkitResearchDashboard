(function(){
   
   /** Controller for the whole SLU WATCH page **/
   angular.module('researchApp').controller('SluController',SluController);
   SluController.$inject = ['$scope','$rootScope','$http','$window','$location','LoginService'];

   function SluController(ngScope,ngRootScope,$http,window,location,LoginService){

      var vm = this;
      initSluController();
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

      function initSluController(){
      }
    

    }

  })();