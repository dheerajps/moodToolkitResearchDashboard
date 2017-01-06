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
      vm.postRegisterInfo = postRegisterInfo;
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
            vm.message = response.data.msg;
            if(response.data.status == true){
               
               Materialize.toast(vm.message, 3000, 'rounded');
               location.path('/overview');
               console.log("login yes");
            }
            else{
               
               Materialize.toast(vm.message, 3000, 'rounded');
               cancelClicked();
            }
         });
      }

      function postRegisterInfo(){
         var localURL ="http://127.0.0.1:8089/";
         var requestURL = localURL+'app/helpers/registerHelper.php';

         var data = { username: ngScope.temp.registerUsername , password: ngScope.temp.registerPassword};
         console.log(data);
         http({
             method: 'POST',
             url: requestURL,
             data: $.param(data),
             headers: {'Content-Type': 'application/x-www-form-urlencoded'}
             
             
         }).then(function (response) {
            console.log(response);
            vm.message = response.data.msg;
            if(response.data.status === 2 || response.data.status == 0){
               Materialize.toast(vm.message, 7000, 'rounded');
               registerCancelClicked();
            }
            else{
               Materialize.toast(vm.message, 7000, 'rounded');
               registerCancelClicked();
               $('#modal2').modal('close');
            }
         });
      }
      function cancelClicked(){
         var master = { username: '' , password:''};
         ngScope.temp = angular.copy(master);
         
         ngScope.loginForm.$setPristine();
      }
      function registerCancelClicked(){
         var master = { registerUsername: '' , registerPassword:'', confirmPassword: ''};
         ngScope.temp = angular.copy(master);
         vm.message = "";
         ngScope.registerForm.$setPristine();
      }
   }
})();



