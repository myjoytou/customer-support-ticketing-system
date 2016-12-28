(function () {
    "use strict";
    var CustomerService;
    var $q;
    var deferred;
    var httpBackend;
    describe('Customer Service', function () {
        beforeEach(angular.mock.module('CustomerApp', function ($provide) {
            $provide.value('$log', console);
        }));

        beforeEach(inject(function (_CustomerService_, _$q_, _$httpBackend_) {
            CustomerService = _CustomerService_;
            $q = _$q_;
            deferred = _$q_.defer();
            httpBackend = _$httpBackend_;
            // spyOn(CustomerService, 'getPreviousTicket').and.returnValue(deferred.promise);
        }));

        it('should exists', function () {
            expect(CustomerService).toBeDefined();
        });

        describe('.getPreviousTicket()', function () {
            it('should exists', function () {
                expect(CustomerService.getPreviousTicket).toBeDefined();
            });

            it('does get all the tickets', function () {
                httpBackend
                    .when('GET', '/assets/customer/home.html')
                    .respond(200, {foo: 'bar'});

                httpBackend
                    .when('GET', '/customers/get_previous_tickets.json')
                    .respond(200, {foo: 'bar'});

                console.log("helllo there ");
                CustomerService.getPreviousTicket().then(function (response) {
                    console.log("the response is: ", response);
                    expect(response).not.toEqual(undefined);
                });
                httpBackend.flush();
            })
        })
    })
})();
