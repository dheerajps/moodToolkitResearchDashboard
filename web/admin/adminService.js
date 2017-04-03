(function(){

    /***** SERVICE to Control Approval process from the Admin *****/
    
   angular.module('researchApp').service('AdminService',['$http', '$rootScope', '$cookies', function AdminService($http,$rootScope,$cookies){

   		return{

         getUsers: getUsers,
         deleteUser: deleteUser,
         approveUser: approveUser
         // updateUserPrivileges: updateUserPrivileges,
         
      };

      function getUsers(){

        var requestURL = '../../app/helpers/admin/getUsers.php';
        return $http.get(requestURL);

      }


      function deleteUser(user){

        var requestURL = '../../app/helpers/admin/deleteUser.php';
        
        return $http({
             method: 'POST',
             url: requestURL,
             data: $.param(user),
             headers: {'Content-Type': 'application/x-www-form-urlencoded'}

         }).then(function (response) {

         });
      }

      function approveUser(user){

        var requestURL = '../../app/helpers/admin/approveUser.php';
        
        return $http({
             method: 'POST',
             url: requestURL,
             data: $.param(user),
             headers: {'Content-Type': 'application/x-www-form-urlencoded'}

         }).then(function (response) {

         });

      }

	}]);
}) ();