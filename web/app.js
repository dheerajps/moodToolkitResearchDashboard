(function(){
   /**** Instantiate the module ****/
   "use strict";
   angular.module('researchApp',['ngRoute','angularCSS','highcharts-ng'])
   		  .config(config);

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
}) ();