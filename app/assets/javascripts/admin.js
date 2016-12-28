/**
 * Created by infibam on 28/12/16.
 */
(function () {
    "use strict";
    angular.module('AdminApp', ['ui.router', 'angular-growl'])

        .config(['$stateProvider', '$urlRouterProvider', 'growlProvider', function ($stateProvider, $urlRouterProvider, growlProvider) {
            $urlRouterProvider.otherwise('/home/welcome');
            $stateProvider.state('adminHome', {
                url: '/home',
                templateUrl: '/assets/admin/admin_home.html',
                controller: 'AdminCtrl'
            });
            $stateProvider.state('adminHome.welcome', {
                url: '/welcome',
                templateUrl: '/assets/admin/admin_welcome.html',
            });

            $stateProvider.state('adminHome.tickets', {
                url: '/tickets',
                templateUrl: '/assets/admin/admin_pending_tickets.html'
            });

            $stateProvider.state('adminHome.users', {
                url: '/users',
                templateUrl: '/assets/admin/user_list.html'
            });

            $stateProvider.state('adminHome.newTicket', {
                url: '/new_ticket',
                templateUrl: '/assets/admin/admin_new_ticket.html'
            });
            growlProvider.globalTimeToLive(3000);
        }])

        .filter('statusFilter', function () {
            return function (status) {
                return status ? 'active' : 'inactive'
            }
        })

        .filter('booleanFilter', function () {
            return function (boolean) {
                return boolean ? 'Yes' : 'No'
            }
        })

    // dashboard.filter('customParent', [function() {
    //     return function(parents) {
    //         var parentName = [];
    //         var individualParent = parents.split(',');
    //         var length = individualParent.length;
    //         console.log('the individualParent is: ', individualParent.length);
    //         for (var i = 0; i < length; ++i) {
    //             parentName.push(individualParent[i].split('|')[0]);
    //         }
    //         return parentName.join(",  ");
    //     };
    // }]);


        .controller('AdminCtrl', ['$scope', '$q', 'AdminService', 'growl', '$state', function ($scope, $q, AdminService, growl, $state) {
            $scope.newTicket = {};
            $scope.pendingTickets;
            $scope.userList;
            $scope.getPendingTicket = function () {
                AdminService.getPendingTicket().then(function (response) {
                    $scope.pendingTickets = response.data.data;
                    console.log('the response is: ', response);
                    $state.go('adminHome.tickets');
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

            $scope.getAllUsers = function () {
                console.log("coming into this function with: ", AdminService);
                AdminService.getAllUsers().then(function (response) {
                    $scope.userList = response.data.data;
                    console.log('the response is: ', response);
                    $state.go('adminHome.users');
                },
                    function (error) {
                        growl.error('Error! ' + error, {title: 'Error!'})
                    }
                )
            };

            $scope.processTicket = function (ticket_id) {
                var request_obj = {ticket_id: ticket_id, status: 'Closed'};
                AdminService.processTicket(request_obj).then(function (response) {
                        growl.success('Ticket Processed!',{title: 'Success!'});
                        $scope.getPendingTicket();
                    },
                    function (error) {
                        console.log('the error is: ', error);
                        growl.error('Error! ' + error,{title: 'Error!'});
                    }
                )
            };

            $scope.deactivateUser = function (user_id) {
                var request_obj = {user_id: user_id}
                AdminService.deactivateUser(request_obj).then(function (response) {
                    growl.success('User Deactivated!', {title: 'Success!'});
                    $scope.getAllUsers();
                },
                    function (error) {
                        console.log('the error is: ', error);
                        growl.error('Error! ' + error,{title: 'Error!'});
                    }
                )
            };

            $scope.activateUser = function (user_id) {
                var request_obj = {user_id: user_id}
                AdminService.activateUser(request_obj).then(function (response) {
                        growl.success('User Deactivated!', {title: 'Success!'});
                        $scope.getAllUsers();
                    },
                    function (error) {
                        console.log('the error is: ', error);
                        growl.error('Error! ' + error,{title: 'Error!'});
                    }
                )
            };

            $scope.assignSupportRoleToUser = function (user_id) {
                var request_obj = {user_id: user_id}
                AdminService.assignSupportRoleToUser(request_obj).then(function (response) {
                        growl.success('User added to Support!', {title: 'Success!'});
                        $scope.getAllUsers();
                    },
                    function (error) {
                        console.log('the error is: ', error);
                        growl.error('Error! ' + error,{title: 'Error!'});
                    }
                )
            };

            $scope.denySupportRoleToUser = function (user_id) {
                var request_obj = {user_id: user_id}
                AdminService.denySupportRoleToUser(request_obj).then(function (response) {
                        growl.success('User removed from Support!', {title: 'Success!'});
                        $scope.getAllUsers();
                    },
                    function (error) {
                        console.log('the error is: ', error);
                        growl.error('Error! ' + error,{title: 'Error!'});
                    }
                )
            };

            $scope.assignAdminRoleToUser = function (user_id) {
                var request_obj = {user_id: user_id}
                AdminService.assignAdminRoleToUser(request_obj).then(function (response) {
                        growl.success('User added to Admin!', {title: 'Success!'});
                        $scope.getAllUsers();
                    },
                    function (error) {
                        console.log('the error is: ', error);
                        growl.error('Error! ' + error,{title: 'Error!'});
                    }
                )
            };

            $scope.denyAdminRoleToUser = function (user_id) {
                var request_obj = {user_id: user_id}
                AdminService.denyAdminRoleToUser(request_obj).then(function (response) {
                        growl.success('User removed from Admin!', {title: 'Success!'});
                        $scope.getAllUsers();
                    },
                    function (error) {
                        console.log('the error is: ', error);
                        growl.error('Error! ' + error,{title: 'Error!'});
                    }
                )
            };

            $scope.downloadClosedTicketReport = function () {
                AdminService.downloadClosedTicketReport().then(function (response) {
                        console.log('the content is: ', response);
                        growl.success('Report Generated!',{title: 'Success!'});
                    },
                    function (error) {
                        growl.error('Error! ' + error,{title: 'Error!'});
                    }
                )
            };
        }])
})();
