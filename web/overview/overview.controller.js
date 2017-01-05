(function(){

   "use strict";
   angular.module('researchApp')
   .controller('OverviewController', OverviewController);
   OverviewController.$inject = ['$scope','$rootScope','$http','OverviewConstants','$timeout','$location'];

   function OverviewController(ngScope,ngRootScope,http,OverviewConstants,timeout,location){


        var vm=this;
        
        
            vm.initOverviewController=initOverviewController;
            //Wait for executing until dom
            timeout(initOverviewController,50);
            function initOverviewController(){
                console.log("hello");

                $(".dropdown-button").dropdown();
                $(".button-collapse").sideNav();
                $('.parallax').parallax();
                $("#navBack").click(function(){
                   history.go(-1);
                });
                vm.studyConstants=OverviewConstants;

            }
            vm.directToNIMHView = function(){
                location.path('/nimh');
            }  
    }

})();