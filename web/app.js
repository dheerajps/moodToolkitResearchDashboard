(function(){
   /**** Instantiate the module ****/
   "use strict";
   angular.module('researchApp',['ngRoute','angularCSS','highcharts-ng','ngCookies'])
   		  .config(config)
          .run(run);

   config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/overview', {
                title: 'Mood Toolkit Overview',
                controller: 'OverviewController',
                templateUrl: 'overview/overview.html',
                css: 'resources/css/style.css',
                controllerAs: 'vm'
            })

            .when('/login', {
                title: 'Mood Toolkit Login',
                controller: 'LandingController',
                templateUrl: 'landing/landing.html',
                css: 'landing/landing-style.css',
                controllerAs: 'vm'
            })

            .when('/nimh', {
                controller: 'NimhController',
                templateUrl: 'nimhStudy.html',
                css: 'resources/css/style.css',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$http','$cookies'];
    function run($rootScope, $location, $http,$cookies) {

        $rootScope.globals = $cookies.getObject('globals') || {};
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
                var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
                var loggedIn = $rootScope.globals.currentUser;
                if (restrictedPage && !loggedIn) {
                    $location.path('/login');
                }
            });
        }
}) ();