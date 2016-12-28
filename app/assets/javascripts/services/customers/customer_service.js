/**
 * Created by infibam on 27/12/16.
 */
(function () {
    "use strict";
    angular.module('CustomerApp')
        .factory('CustomerService', ['$http', '$q', function ($http, $q) {
            var customers = {};
            var getPreviousTickets = function () {
                var deferred = $q.defer();
                $http.get('/customers/get_previous_tickets.json').then(function (response) {
                    deferred.resolve(response);
                },
                    function (error) {
                        deferred.reject(error);
                    }
                );
                return deferred.promise;
            };

            var createTicket = function (params) {
                var deferred = $q.defer();
                $http.post('/customers/create_new_ticket.json', params).then(function (response) {
                    deferred.resolve(response);
                },
                    function (error) {
                        deferred.reject(error);
                    }
                );
                return deferred.promise;
            };

            customers.getPreviousTickets = getPreviousTickets;
            customers.createTicket = createTicket;
            return customers;
        }])
})();
