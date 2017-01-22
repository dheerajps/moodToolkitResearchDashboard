/** Custom Service which does the get request for SLU WATCH Data **/
(function(){
   angular.module('researchApp').service('sluWatchAPI',['$http', function sluWatchAPI($http){

      
      var data ={ ID : ''};
      
      return{
         
         getsluWatchData: getsluWatchData,
         getUser: getUser,
         setUser: setUser
          
      };
      function getsluWatchData(){
       
          var localURL ="http://127.0.0.1:8090/";
          var requestURL = localURL+'app/studies/sluWatchStudy.php';
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