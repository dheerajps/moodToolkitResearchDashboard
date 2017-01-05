(function(){

   "use strict";
   angular
      .module('researchApp')
      .controller('LandingController', LandingController);
   LandingController.$inject = ['$scope','$rootScope','$http','$location'];

   function LandingController(ngScope,ngRootScope,http,location){

      
      var vm = this;
      vm.directToLogin=directToLogin;
      vm.initModal = initModal;
      vm.directToRegister=directToRegister;
      vm.showLoginModal=false; 
      vm.showRegisterModal =false;
      vm.postLoginInfo =postLoginInfo;
      vm.cancelClicked =cancelClicked;
   
      initModal();

      function initModal(){
            $('#modal1').modal();
            $('#modal2').modal();
            $('#modal1,#modal2').modal({
            dismissible: true,
            opacity: .5,
            in_duration: 300,
            out_duration: 200,
            starting_top: '4%',
            ending_top: '10%',
            ready: function(modal, trigger) {
            }
          });
            vm.showLoginModal=false;
            vm.showRegisterModal =false;
      }
      
      function directToLogin(){
         console.log("hi");
         vm.message ="";
         vm.showLoginModal=true;
         $('#modal1').modal('open');
         
      }

      function directToRegister(){
         vm.showRegisterModal = true;
         $('#modal2').modal('open');
      }

      function postLoginInfo(){
         var localURL ="http://127.0.0.1:8088/";
         var requestURL = localURL+'app/helpers/loginHelper.php';
         
         var data = { username: ngScope.temp.username , password: ngScope.temp.password};
         
         http({
             method: 'POST',
             url: requestURL,
             data: $.param(data),
             headers: {'Content-Type': 'application/x-www-form-urlencoded'}
             
             
         }).then(function (response) {
            console.log(response.data);
            
            if(response.data.status == true){
               vm.message = response.data.msg;
               location.path('/overview');
               console.log("login yes");
            }
            else{
               vm.message = response.data.msg;
               console.log("login no");
               cancelClicked();
            }
         });
      }
      function postRegisterInfo(){
         var localURL ="http://127.0.0.1:8089/";
         var requestURL = localURL+'app/helpers/registerHelper.php';

         var data = { username: ngScope.temp.registerUsername , password: ngScope.temp.registerPassword};
         
         http({
             method: 'POST',
             url: requestURL,
             data: $.param(data),
             headers: {'Content-Type': 'application/x-www-form-urlencoded'}
             
             
         }).then(function (response) {
            console.log(response.data);
            
            if(response.data.status == true){
               vm.message = response.data.msg;
               alert("Registration Complete. Please click Login to login to the app");
               location.path('/login');
               console.log("login yes");
            }
            else{
               vm.message = response.data.msg;
               console.log("login no");
               cancelClicked();
            }
         });
      }
      function cancelClicked(){
         var master = { username: '' , password:''};
         ngScope.temp = angular.copy(master);
         ngScope.loginForm.$setPristine();
      }
      function registerCancelClicked(){
         var master = { registerUsername: '' , registerPassword:'', confirmPassword};
         ngScope.temp = angular.copy(master);
         ngScope.registerForm.$setPristine();
      }
   }
})();



