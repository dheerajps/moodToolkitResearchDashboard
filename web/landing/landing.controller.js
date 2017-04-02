(function(){
   /***** Landing Page Controller
   - Handles both login and register modal *****/
   "use strict";
   angular
      .module('researchApp')
      .controller('LandingController', LandingController);
   LandingController.$inject = ['$scope','$rootScope','$http','$location', 'LoginService'];

   function LandingController(ngScope,ngRootScope,http,location,LoginService){


      var vm = this;
      vm.directToLogin=directToLogin;
      vm.initModal = initModal;
      vm.directToRegister=directToRegister;
      vm.showLoginModal=false;
      vm.showRegisterModal =false;
      vm.postLoginInfo =postLoginInfo;
      vm.postRegisterInfo = postRegisterInfo;
      vm.cancelClicked =cancelClicked;
      LoginService.clearCredentials();

      initModal();

      //Initialize the modal
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

         vm.message ="";
         vm.showLoginModal=true;
         $('#modal1').modal('open');

      }

      function directToRegister(){
         registerCancelClicked();
         vm.showRegisterModal = true;
         $('#modal2').modal('open');
      }

      //Check login by posting    to DB
      function postLoginInfo(){


         var requestURL = '../app/helpers/loginHelper.php';


         var data = { username: ngScope.temp.username , password: ngScope.temp.password};

         http({
             method: 'POST',
             url: requestURL,
             data: $.param(data),
             headers: {'Content-Type': 'application/x-www-form-urlencoded'}


         }).then(function (response) {
            
            vm.message = response.data.msg;
            if(response.data.status == true){
               console.log(response.data.userInfo);
               LoginService.setCredentials(response.data.userInfo);
               Materialize.toast(vm.message, 5000, 'rounded');
               location.path('/overview');
               
            }
            else{
               Materialize.toast(vm.message, 5000, 'rounded');
               cancelClicked();
            }
         });
      }

      //Save userInfo to DB
      function postRegisterInfo(){

         var requestURL = '../app/helpers/registerHelper.php';


         var data = { 
                      username: ngScope.temp.registerUsername ,
                      password: ngScope.temp.registerPassword ,
                      fname: ngScope.temp.registerFname ,
                      lname: ngScope.temp.registerLname ,
                      email: ngScope.temp.registerEmail ,
                      affiliation: ngScope.temp.registerAffiliation ,
                    };
         
         http({
             method: 'POST',
             url: requestURL,
             data: $.param(data),
             headers: {'Content-Type': 'application/x-www-form-urlencoded'}


         }).then(function (response) {
            
            vm.message = response.data.msg;
            if(response.data.status === 2 || response.data.status == 0){
               console.log(vm.message);
               Materialize.toast(vm.message, 10000, 'rounded');
               registerCancelClicked();
            }
            else{
               Materialize.toast(vm.message, 10000, 'rounded');
               console.log(vm.message);
               registerCancelClicked();
               $('#modal2').modal('close');
            }
         });
      }

      //Clear form and set pristine
      function cancelClicked(){
         var master = { username: '' , password:'' };
         ngScope.temp = angular.copy(master);

         ngScope.loginForm.$setPristine();
      }
      function registerCancelClicked(){
         var master = { registerUsername: '' , registerPassword:'', confirmPassword: '',fname: '' , lname: '' , email: '' , affiliation: ''};
         ngScope.temp = angular.copy(master);
         vm.message = "";
         ngScope.registerForm.$setPristine();
      }
   }
})();



