(function(){

   "use strict";
   angular.module('researchApp',[]).controller('loginController', loginController);
   loginController.$inject = ['$scope','$rootScope','$http'];

   function loginController(ngScope,ngRootScope,http){

      
      var vm = this;
      vm.openModal=openModal;
      vm.initModal = initModal;
      vm.directToOverview=directToOverview;
      vm.showModal=false; 
      vm.postLoginInfo =postLoginInfo;
      vm.cancelClicked =cancelClicked;
   
      initModal();

      function initModal(){
            $('#modal1').modal();
            $('#modal1').modal({
            dismissible: true,
            opacity: .5,
            in_duration: 300,
            out_duration: 200,
            starting_top: '4%',
            ending_top: '10%',
            ready: function(modal, trigger) {
            }
          });
            vm.showModal=false;
      }
      
      function openModal(){
         console.log("hi");
         vm.showModal=true;
         $('#modal1').modal('open');
         
      }

      function directToOverview(){
         window.location.href = '../overview/overview.html';

      }

      function postLoginInfo(){
         var localURL ="http://127.0.0.1:8080/";
         var requestURL = localURL+'app/helpers/loginHelper.php';
         var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
         }
         var data = { username: ngScope.temp.username , password: ngScope.temp.password};
         console.log(data);
         http.post(requestURL,data,config).then(function (message) {
            
            console.log("logged in with these credentials : " + data.username);
         });
      }

      function cancelClicked(){
         var master = { username: '' , password:''};
         ngScope.temp = angular.copy(master);
         ngScope.loginForm.$setPristine();
      }
   }
})();



