/** Custom Service which does the get request for NIMH Data **/
(function(){
   angular.module('researchApp').service('nimhAPI',['$http', function nimhAPI($http){


      var data ={ ID : ''};

      return{

         getNIMHData: getNIMHData,
         getUser: getUser,
         setUser: setUser

      };
      function getNIMHData(){

          var requestURL = '../../app/studies/nimhStudyResponse.json';
          return $http.get(requestURL);
      }

      function setUser(user){
        data.ID = user;
        
      }

      function getUser(){
        
        return data.ID;
      }
   }]);
}) ();