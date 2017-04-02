(function(){

  /***** Controller for Admin page *****/
  
   "use strict";
   angular.module('researchApp')
   .controller('AdminController', AdminController);
   AdminController.$inject = ['$scope','$rootScope','$http','OverviewConstants','$timeout','$location','LoginService','AdminService'];

   function AdminController(ngScope,ngRootScope,http,OverviewConstants,timeout,location,LoginService,AdminService){


            var vm=this;

            vm.initAdminController = initAdminController;
            vm.getAllUsers = getAllUsers;
            vm.deleteSelectedUser = deleteSelectedUser;
            vm.noNewUsersFlag = true;
            vm.allNewUsers = [];
            vm.allApprovedUsers = [];
            
            //Wait for executing until dom
            timeout(initAdminController,50);
            function initAdminController(){
                
                $(".dropdown-button").dropdown();
                $(".button-collapse").sideNav();
                $("#navBack").click(function(){
                   history.go(-1);
                });
               
                getAllUsers();
            }

            vm.userInfo = LoginService.getCredentials();

            vm.initiateLogOut = function(){
                vm.message = "You have Logged out successfully!"
                LoginService.clearCredentials();
                location.path('/login');
                Materialize.toast(vm.message, 7000, 'rounded');
            }

            function getAllUsers(){

              AdminService.getUsers().then(function (response){


                vm.allUsers = response.data;
                console.log(vm.allUsers);
                vm.allApprovedUsers = vm.allUsers['existingUsers'];

                vm.allNewUsers = vm.allUsers['newUsers'];

                vm.noNewUsersFlag = (vm.allNewUsers == null) ? true : false;

              });

            }

            function deleteSelectedUser(user,index){

              console.log("calling the delete service");
              if(user['isApproved']==='F'){
                vm.newUserDeletingFlag = true;
              }
              else if(user['isApproved'] ==='T'){
                vm.oldUserDeletingFlag = true;
              }


              AdminService.deleteUser(user).then(function(){

                console.log("deleting the user");

                if(vm.newUserDeletingFlag){
                  vm.allNewUsers.splice(index, 1);
                  if(vm.allNewUsers.length == 0){
                    vm.noNewUsersFlag = true;
                  }
                }
                else if(vm.oldUserDeletingFlag){
                  vm.allApprovedUsers.splice(index, 1);
                }

              });

            }

            

    }

})();