(function(){
   'use strict';
   /** Controller for the whole SLU WATCH page **/
   angular.module('researchApp').controller('SluController',SluController);
   SluController.$inject = ['$scope','$rootScope','$http','$window','$location','LoginService','sluWatchAPI'];

   function SluController(ngScope,ngRootScope,$http,window,location,LoginService,sluWatchAPI){

      var vm = this;
      
      vm.takeBack = takeBack;
      vm.initSluController = initSluController;
      vm.showOverviewPageFlag = true;
      vm.showUserPageFlag = false;

      /** Initiate LogOut **/
      vm.initiateLogOut =function(){

        vm.message = "You have logged out Successfully!";
        LoginService.clearCredentials();
        Materialize.toast(vm.message, 7000, 'rounded');
        location.path('/login');
      }
      /** Take back to previous window **/
      function takeBack(){
        if(!vm.showUserPageFlag){
           window.history.back();
        }
        else{
          vm.showUserPageFlag=false;
          vm.showOverviewPageFlag=true;
        }
      }

      /** Sets flags and initiates route to SLU user view **/

      vm.navigateToUserPage = function(userId){
          vm.showOverviewPageFlag = false;
          vm.showUserPageFlag=true;
          window.scrollTo(0,0);
          vm.currentUser=userId;
          //vm.drawUserPageGraphs(vm.currentUser);
          console.log(vm.currentUser);
      }

      /*** Initialize SLU controller where the get call and main functionality happens ***/
      function initSluController(){

        console.log("in slu");

        sluWatchAPI.getsluWatchData().then(function (response){

            console.log(response.data);

            vm.users = [];
            vm.cigs = [];
            vm.drinks = [];
            vm.posAvg = [];
            vm.negAvg = [];
            vm.impulsivityAvg = [];

            /** GET THE RESPONSE DATA AND STORE IT **/
            vm.sluData = response.data;

            vm.sluData.users = vm.sluData["userStudyStats"];
            
            vm.colors = ['#FF9655', '#adfc71', '#dd616e', '#454545', '#b3aee5', '#64E572', '#FFF263', '#66FFCC', '#51b93e'];

            angular.forEach(vm.sluData.users, function(value, key){
              
              vm.users.push('USER ' + value.user);
              vm.cigs.push(value['cigarettes']);
              vm.drinks.push(value['drinksConsumed']);
              vm.posAvg.push(value['posAvg']);
              vm.negAvg.push(value['negAvg']);
              vm.impulsivityAvg.push(value['impulsivityAvg']);

            }); //END OF FOR-LOOP

            /** Find total of any property **/
            vm.findTotal = function(property){
                 var total = 0;
                 for (var i = 0; i < vm.sluData.users.length ; i++) {
                       total += vm.sluData.users[i][property];
                 }
                 return (total);
            }

            /** All the graphs on the overview page goes under here **/


            vm.cigsDrinksGraph = {

                options: {

                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Substance Stats'
                    },
                    xAxis: {
                        categories: vm.users,
                        crosshair: true,
                        title: {
                          text: 'Users'
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Quantity (number)'
                        },
                        tickInterval: 50
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    }
                },
                series: [{
                    name: 'Cigarettes',
                    color: vm.colors[1],
                    data: vm.cigs

                }, {
                    name: 'Drinks',
                    color: vm.colors[0],
                    data: vm.drinks

                }],
                credits: {
                    enabled: false
                }
            } //END of cigsDrinksGraph
            

            vm.averageValuesGraph = {

              options: {


                title: {
                    text: 'Pos, Neg and Impulsivity Averages',
                    x: -20 //center
                },
                subtitle: {
                    text: 'Across all Patients',
                    x: -20
                },
                xAxis: {
                    categories: vm.users,
                    crosshair: true,
                    title: {
                      text: 'Users'
                    } 
                },
                yAxis: {
                    title: {
                        text: 'Average Values'
                    },
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: vm.colors[4]
                    }],
                    tickInterval: 0.5
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.3f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
              },
              series: [{
                    name: 'Positive Avg',
                    data: vm.posAvg
                }, {
                    name: 'Negative Avg',
                    data: vm.negAvg
                }, {
                    name: 'Impulsivity',
                    data: vm.impulsivityAvg
                }]
            } //END of averageValuesGraph

        }); //END OF .then of API CALL

      } //END of initSluController function

      initSluController();
    }

})();