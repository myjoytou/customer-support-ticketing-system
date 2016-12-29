(function () {
    "use strict";

    angular.module('CustomerApp', ['ui.router', 'angular-growl'])

        .config(['$stateProvider', '$urlRouterProvider', 'growlProvider', function ($stateProvider, $urlRouterProvider, growlProvider) {
            $urlRouterProvider.otherwise('/home/welcome');
            $stateProvider.state('home', {
                url: '/home',
                templateUrl: '/assets/customer/home.html',
                controller: 'HomeCtrl'
            });
            $stateProvider.state('home.welcome', {
                url: '/welcome',
                templateUrl: '/assets/customer/welcome.html',
            });

            $stateProvider.state('home.tickets', {
                url: '/tickets',
                templateUrl: '/assets/customer/tickets.html'
            });

            $stateProvider.state('home.newTicket', {
                url: '/new_ticket',
                templateUrl: '/assets/customer/new_ticket.html'
            });
            growlProvider.globalTimeToLive(3000);
        }])

        .controller('HomeCtrl', ['$scope', '$q', 'CustomerService', 'growl', '$state', function ($scope, $q, CustomerService, growl, $state) {
            $scope.newTicket = {};
            $scope.previousTickets;
            $scope.viewPreviousTickets = function () {
                CustomerService.getPreviousTickets().then(function (response) {
                    $scope.previousTickets = response.data.data;
                    $state.go('home.tickets');
                    if (response.data.data.length == 0) {
                        growl.error('No Tickets Found!',{title: 'Error!'});
                    }
                },
                    function (error) {
                        growl.error('Error! ' + error,{title: 'Error!'});
                    }
                )
            };
            console.log('coming into the controller');

            $scope.goToCreateMenu = function () {
                $state.go('home.newTicket');
            };
            
            $scope.createNewTicket = function () {
                console.log('coming into this function', $scope.newTicket);
                CustomerService.createTicket($scope.newTicket).then(function (response) {
                    growl.success('Ticket Created!',{title: 'Success!'});
                    $scope.newTicket = {};
                },
                    function (error) {
                        console.log('the error is: ', error);
                        growl.error('Error! ' + error,{title: 'Error!'});
                    }
                )
            }
        }])
})();
