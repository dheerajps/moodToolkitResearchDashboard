(function(){

   "use strict";
   angular.module('researchApp',[]).controller('loginController', loginController);
   loginController.$inject = ['$scope','$rootScope','$http'];

   function loginController(ngScope,ngRootScope,http){

      
      var vm =this;
      vm.openModal=openModal;
      vm.initModal = initModal;
      vm.directToOverview=directToOverview;
      vm.showModal=false;

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

   }
})();



