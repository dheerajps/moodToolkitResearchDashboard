(function(){

    /***** SERVICE to Control Approval process from the Admin *****/
    
   angular.module('researchApp').service('AdminService',['$http', '$rootScope', '$cookies', function AdminService($http,$rootScope,$cookies){

   		return{

         getUsers: getUsers,
         deleteUser: deleteUser,
         // updateUserPrivileges: updateUserPrivileges,
         
      };

      function getUsers(){

        var requestURL = '../../app/helpers/admin/getUsers.php';
        return $http.get(requestURL);

      }


      function deleteUser(user){

        var requestURL = '../../app/helpers/admin/deleteUser.php';
        console.log("Inside delete");

        return $http({
             method: 'POST',
             url: requestURL,
             data: $.param(user),
             headers: {'Content-Type': 'application/x-www-form-urlencoded'}

         }).then(function (response) {

             console.log("response:  " + response.data);
             console.log(response.data.msg);

         });
      }


	}]);
}) ();