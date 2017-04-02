(function(){

  /***** Controller for Overview page *****/
  
   "use strict";
   angular.module('researchApp')
   .controller('OverviewController', OverviewController);
   OverviewController.$inject = ['$scope','$rootScope','$http','OverviewConstants','$timeout','$location','LoginService'];

   function OverviewController(ngScope,ngRootScope,http,OverviewConstants,timeout,location,LoginService){


            var vm=this;
        
        
            vm.initOverviewController=initOverviewController;
            //Wait for executing until dom
            timeout(initOverviewController,50);
            function initOverviewController(){
                
                $(".dropdown-button").dropdown();
                $(".button-collapse").sideNav();
                $('.parallax').parallax();
                $("#navBack").click(function(){
                   history.go(-1);
                });
                vm.studyConstants=OverviewConstants;

            }

            vm.userInfo = LoginService.getCredentials();
            console.log(vm.userInfo);

            vm.isAdminFlag = (vm.userInfo.currentUser.isAdmin == true) ? true : false;

            vm.directToAdminView = function(){
              vm.message = "Hello! " + vm.userInfo.currentUser.fname + " you are now entering ADMIN view";
              location.path('/admin');
              Materialize.toast(vm.message, 7000, 'rounded');
            }

            vm.directToStudy = function(link) {
                location.path('/'+link);
            }

            vm.initiateLogOut = function(){
                vm.message = "You have Logged out successfully!"
                LoginService.clearCredentials();
                location.path('/login');
                Materialize.toast(vm.message, 7000, 'rounded');
            }

    }

})();