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
       
          var localURL ="http://127.0.0.1:8080/";
          var requestURL = localURL+'app/studies/nimhStudy.php';
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