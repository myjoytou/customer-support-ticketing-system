/**
 * Created by infibam on 28/12/16.
 */
(function () {
    "use strict";

    angular.module('SupportApp', ['ui.router', 'angular-growl'])

        .config(['$stateProvider', '$urlRouterProvider', 'growlProvider', function ($stateProvider, $urlRouterProvider, growlProvider) {
            $urlRouterProvider.otherwise('/support_home/tickets');
            $stateProvider.state('supportHome', {
                url: '/support_home',
                templateUrl: '/assets/support/support_home.html',
                controller: 'SupportCtrl'
            });
            $stateProvider.state('supportHome.welcome', {
                url: '/welcome',
                templateUrl: '/assets/support/support_welcome.html',
            });

            $stateProvider.state('supportHome.tickets', {
                url: '/tickets',
                templateUrl: '/assets/support/support_pending_tickets.html'
            });
            growlProvider.globalTimeToLive(3000);
        }])

        .controller('SupportCtrl', ['$scope', '$q', 'SupportService', 'growl', '$state', function ($scope, $q, SupportService, growl, $state) {
            $scope.pendingTickets;
            $scope.getPendingTicket = function () {
                SupportService.getPendingTicket().then(function (response) {
                    $scope.pendingTickets = response.data.data;
                    console.log('the response is: ', response);
                    $state.go('supportHome.tickets');
                    if (response.data.data.length == 0) {
                        growl.error('No Tickets Found!',{title: 'Error!'});
                    }
                },
                    function (error) {
                        growl.error('Error!',{title: 'Error!'});
                    }
                )
            };
            console.log('coming into the controller');

            $scope.processTicket = function (ticket_id) {
                var request_obj = {ticket_id: ticket_id, status: 'Closed'};
                SupportService.processTicket(request_obj).then(function (response) {
                    console.log('processed!');
                    growl.success('Ticket Processed!',{title: 'Success!'});
                    $scope.getPendingTicket();
                },
                    function (error) {
                        console.log('the error is: ', error);
                        growl.error('Error! ' + error,{title: 'Error!'});
                    }
                )
            };

            $scope.downloadClosedTicketReport = function () {
                SupportService.downloadClosedTicketReport().then(function (response) {
                    console.log('the content is: ', response);
                    growl.success('Report Generated!',{title: 'Success!'});
                },
                    function (error) {
                        growl.error('Error! ' + error,{title: 'Error!'});
                    }
                )
            };

            $scope.getPendingTicket();
        }])
})();
