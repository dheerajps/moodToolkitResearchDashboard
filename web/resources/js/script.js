(function(){
   /**** Instantiate the module ****/
   "use strict";
   var app= angular.module('researchApp',[]);
   
   /** Custom Service which does the get request for NIMH Data **/
   app.service('nimhAPI',['$http', function nimhAPI($http){


      return{
         
         getNIMHData: getNIMHData
          
      };
      function getNIMHData(){
       
          var localURL ="http://127.0.0.1:8080/";
          var requestURL = localURL+'app/studies/nimhStudy.php';
          return $http.get(requestURL);         
      }
   }]);

   /** Controller for the whole NIMH page **/
   app.controller('nimhController',nimhController);
   nimhController.$inject = ['$scope','$rootScope','$http','nimhAPI'];

   function nimhController(ngScope,ngRootScope,$http,nimhAPI){

      var vm = this;
      initNIMHController();
      function initNIMHController(){
         

         console.log("hello");
         nimhAPI.getNIMHData().then(function (d){

             vm.nimhData = d.data;
             //console.log(vm.nimhData);
             vm.surveysComplete = [];
             vm.daysInStudy =[];
             vm.totalCompliance=null;
             vm.nimhData.users = vm.nimhData.participants;
             
             console.log(vm.nimhData.users);

             vm.findAvgCompliance = function(){
               var total = 0;
               for (var i = 0; i < vm.nimhData.users.length ; i++) {
                     total+=vm.nimhData.users[i]['compliance'];
               }
               return (total/i).toFixed(2);
             }

             vm.findTotal = function(property){
               var total = 0;
               for (var i = 0; i < vm.nimhData.users.length ; i++) {
                     total+=vm.nimhData.users[i][property];
               }
               return (total);
             }

          });
      }
   }
   /** To handle highcharts stuff on this page **/
   app.controller('nimhGraphController')


}) ();