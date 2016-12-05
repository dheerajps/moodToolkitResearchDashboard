(function(){

   "use strict";
   var app= angular.module('researchApp',[]);
   app.constant('overviewConstants',
    {
        alcoholStudy:{
            nameOfStudy: "Alcohal Craving",
            link: "alcoholCravingStudy.html",
            imageLink:"../resources/images/alcohol.jpg",
            description: "The Alcohol Craving Study is was funded by X and was conducted to study the relationship between alcohol craving, context, and phisiological data."
        },
        nimhStudy:{
            nameOfStudy: "NIMH",
            link: "nimhStudy.html",
            imageLink:"../resources/images/nih.png",
            description: "Here is some more information about this product that is only revealed once clicked on."

        },
        moodDysregulationStudy:{
            nameOfStudy: "Mood Dysregulation",
            link: "moodDesregulationStudy.html",
            imageLink:"../resources/images/mood.jpg",
            description: "Here is some more information about this product that is only revealed once clicked on."

        },
        sluWatchStudy:{
            nameOfStudy: "SLU WATCH",
            link: "sluWatchStudy.html",
            imageLink:"../resources/images/watch.png",
            description: "Here is some more information about this product that is only revealed once clicked on."
        }

    });
   app.controller('overviewController', overviewController);
   overviewController.$inject = ['$scope','$rootScope','$http','overviewConstants'];

   function overviewController(ngScope,ngRootScope,http,overviewConstants){


        var vm=this;
        vm.initOverviewController=initOverviewController;

        initOverviewController();

        function initOverviewController(){
            console.log("hello");

            $(".dropdown-button").dropdown();
            $(".button-collapse").sideNav();
            $('.parallax').parallax();
            $("#navBack").click(function(){
               history.go(-1);
            });

            vm.studyConstants=overviewConstants;
            console.log(vm.studyConstants);

        }


        

    }

})();