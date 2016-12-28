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
            })
            growlProvider.globalTimeToLive(5000);
        }])

        .controller('HomeCtrl', ['$scope', '$q', 'CustomerService', 'growl', '$state', function ($scope, $q, CustomerService, growl, $state) {
            $scope.newTicket = {};
            $scope.previousTickets;
            $scope.viewPreviousTickets = function () {
                CustomerService.getPreviousTickets().then(function (response) {
                    $scope.previousTickets = response.data.data;
                    console.log('the response is: ', response);
                    $state.go('home.tickets');
                    if (response.data.data.length == 0) {
                        Flash.create('success', 'No Tickets Found!', 3000);
                    }
                    else {
                        Flash.create('success', 'Success!', 6000);
                    }
                },
                    function (error) {
                        Flash.create('error', error, 3000);
                    }
                )
            };
            console.log('coming into the controller')

            $scope.goToCreateMenu = function () {
                $state.go('home.newTicket');
            };
            
            $scope.createNewTicket = function () {
                console.log('coming into this function', $scope.newTicket);
                CustomerService.createTicket($scope.newTicket).then(function (response) {
                    Flash.create('success', 'Ticket creation successful!', 3000);
                    $scope.newTicket = {};
                },
                    function (error) {
                        console.log('the error is: ', error);
                        Flash.create('error', "Error: " + error, 3000);
                    }
                )
            }
        }])
})();
