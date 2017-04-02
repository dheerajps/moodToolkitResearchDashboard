(function(){

  /***** Controller for Admin page *****/
  
   "use strict";
   angular.module('researchApp')
   .controller('AdminController', AdminController);
   AdminController.$inject = ['$scope','$rootScope','$http','OverviewConstants','$timeout','$location','LoginService','ApproveService'];

   function AdminController(ngScope,ngRootScope,http,OverviewConstants,timeout,location,LoginService,ApproveService){


            var vm=this;

            vm.initAdminController=initAdminController;
            //Wait for executing until dom
            timeout(initAdminController,50);
            function initAdminController(){
                
                
                $("#navBack").click(function(){
                   history.go(-1);
                });
               

            }

            vm.userInfo = LoginService.getCredentials();

            vm.initiateLogOut = function(){
                vm.message = "You have Logged out successfully!"
                LoginService.clearCredentials();
                location.path('/login');
                Materialize.toast(vm.message, 7000, 'rounded');
            }

            ApproveService.getUsers().then(function (response){


              vm.getAllUsers = response.data;
              console.log(vm.getAllUsers);
              vm.allApprovedUsers = vm.getAllUsers['existingUsers'];

              vm.allNewUsers = vm.getAllUsers['newUsers'];

              vm.noNewUsersFlag = (vm.allNewUsers == null) ? true : false;

            });

    }

})();