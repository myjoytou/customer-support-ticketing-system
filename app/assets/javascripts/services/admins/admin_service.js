/**
 * Created by infibam on 29/12/16.
 */
(function () {
    "use strict";
    angular.module('AdminApp')
        .factory('AdminService', ['$http', '$q', function ($http, $q) {
            var admins = {};
            var getPendingTicket = function () {
                var deferred = $q.defer();
                $http.get('/admins/get_pending_tickets.json').then(function (response) {
                        deferred.resolve(response);
                    },
                    function (error) {
                        deferred.reject(error.data);
                    }
                );
                return deferred.promise;
            };

            var getAllUsers = function () {
                var deferred = $q.defer();
                $http.get('/admins/get_all_users.json').then(function (response) {
                    deferred.resolve(response);
                },
                    function (error) {
                        deferred.reject(error.data);
                    }
                );
                return deferred.promise;
            };

            var processTicket = function (params) {
                var deferred = $q.defer();
                $http.post('/admins/process_pending_tickets.json', params).then(function (response) {
                        deferred.resolve(response);
                    },
                    function (error) {
                        deferred.reject(error.data);
                    }
                );
                return deferred.promise;
            };

            var downloadClosedTicketReport = function () {
                var deferred = $q.defer();
                $.fileDownload('/admins/get_closed_tickets_report.pdf', {
                    successCallback: function (url) { deferred.resolve('Success!');},
                    failCallback: function (url) { deferred.reject('Erro.datar!') }
                });
                return deferred.promise;
            };

            var activateUser = function (params) {
                var deferred = $q.defer();
                $http.post('/admins/activate_user.json', params).then(function (response) {
                    deferred.resolve(response);
                },
                    function (error) {
                        deferred.reject(error.data);
                    }
                );
                return deferred.promise;
            };

            var deactivateUser = function (params) {
                var deferred = $q.defer();
                $http.post('/admins/deactivate_user.json', params).then(function (response) {
                        deferred.resolve(response);
                    },
                    function (error) {
                        deferred.reject(error.data);
                    }
                );
                return deferred.promise;
            };

            var assignSupportRoleToUser = function (params) {
                var deferred = $q.defer();
                $http.post('/admins/assign_support_role.json', params).then(function (response) {
                        deferred.resolve(response);
                    },
                    function (error) {
                        deferred.reject(error.data);
                    }
                );
                return deferred.promise;
            };

            var assignAdminRoleToUser = function (params) {
                var deferred = $q.defer();
                $http.post('/admins/assign_admin_role.json', params).then(function (response) {
                        deferred.resolve(response);
                    },
                    function (error) {
                        deferred.reject(error.data);
                    }
                );
                return deferred.promise;
            };

            var denyAdminRoleToUser = function (params) {
                var deferred = $q.defer();
                $http.post('/admins/deny_admin_role.json', params).then(function (response) {
                        deferred.resolve(response);
                    },
                    function (error) {
                        deferred.reject(error.data);
                    }
                );
                return deferred.promise;
            };

            var denySupportRoleToUser = function (params) {
                var deferred = $q.defer();
                $http.post('/admins/deny_support_role.json', params).then(function (response) {
                        deferred.resolve(response);
                    },
                    function (error) {
                        deferred.reject(error.data);
                    }
                );
                return deferred.promise;
            };

            admins.processTicket = processTicket;
            admins.getAllUsers = getAllUsers;
            admins.getPendingTicket = getPendingTicket;
            admins.downloadClosedTicketReport = downloadClosedTicketReport;
            admins.activateUser = activateUser;
            admins.deactivateUser = deactivateUser;
            admins.assignSupportRoleToUser = assignSupportRoleToUser;
            admins.assignAdminRoleToUser = assignAdminRoleToUser;
            admins.denyAdminRoleToUser = denyAdminRoleToUser;
            admins.denySupportRoleToUser = denySupportRoleToUser;
            return admins;
        }])
})();
