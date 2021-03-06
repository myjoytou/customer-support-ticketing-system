/**
 * Created by infibam on 28/12/16.
 */
(function () {
    "use strict";
    angular.module('SupportApp')
        .factory('SupportService', ['$http', '$q', function ($http, $q) {
            var supports = {};
            var getPendingTicket = function () {
                var deferred = $q.defer();
                $http.get('/supports/get_pending_tickets.json').then(function (response) {
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
                $http.post('/supports/process_pending_tickets.json', params).then(function (response) {
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
                $.fileDownload('/supports/get_closed_tickets_report.pdf', {
                    successCallback: function (url) { deferred.resolve('Success!');},
                    failCallback: function (url) { deferred.reject('Error!') }
                });
                return deferred.promise;
            };

            supports.getPendingTicket = getPendingTicket;
            supports.processTicket = processTicket;
            supports.downloadClosedTicketReport = downloadClosedTicketReport;
            return supports;
        }])
})();
