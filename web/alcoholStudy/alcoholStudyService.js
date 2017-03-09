/** Custom Service which does the get request for ALCOHOL STUDY Data **/
(function(){
   angular.module('researchApp').service('alcoholStudyAPI',['$http', function alcoholStudyAPI($http){


      var data ={ ID : ''};

      return{

         getAlcoholStudyData: getAlcoholStudyData,
         getUser: getUser,
         setUser: setUser

      };
      function getAlcoholStudyData(){


          var requestURL = '../../app/studies/alcoholStudyResponse.json';
          return $http.get(requestURL);

      }

      function setUser(user){
        data.ID = user;
        console.log("user is set to "+ data.ID);
      }

      function getUser(){
        console.log("sending user as "+ data.ID);
        return data.ID;
      }
   }]);
}) ();