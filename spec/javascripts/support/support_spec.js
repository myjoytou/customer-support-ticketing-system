/**
 * Created by infibam on 29/12/16.
 */
(function () {
    "use strict";

    beforeEach(module('SupportApp'));
    describe('SupportCtrl', function () {
        var httpBackend;
        var SupportService;
        var scope;
        var SupportController = {};
        var rootScope;
        var state;
        var location;
        beforeEach(inject(function (_$httpBackend_, _SupportService_, _$state_, _$location_) {
            httpBackend = _$httpBackend_;
            SupportService = _SupportService_;
            state = _$state_;
            location = _$location_;
            spyOn(SupportService, 'getPendingTicket').and.callThrough();
            spyOn(SupportService, 'processTicket').and.callThrough();
        }));

        beforeEach(inject(function ($controller, $rootScope, $q){
            scope = $rootScope.$new();
            rootScope = $rootScope;
            SupportController = $controller('SupportCtrl', {$scope: scope, SupportService: SupportService});
            spyOn(state, 'go').and.callFake(function (state) {
                console.log('coming to the state')
            });
        }));

        describe('routes testing', function () {
            it('should go to home', function () {
                httpBackend
                    .when('GET', '/assets/support/support_home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/support/support_welcome.html')
                    .respond(200, {});

                location.path('/support_home');
                httpBackend.flush();
                scope.$apply();
                expect(state.current.name).toEqual('supportHome')
            });

            it('should go to home.welcome', function () {
                httpBackend
                    .when('GET', '/assets/support/support_home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/support/support_welcome.html')
                    .respond(200, {});

                location.path('/support_home/welcome');
                httpBackend.flush();
                scope.$apply();
                expect(state.current.name).toEqual('supportHome.welcome');
            });

            it('should go to home.tickets', function () {
                httpBackend
                    .when('GET', '/assets/support/support_home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/support/support_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/support/support_pending_tickets.html')
                    .respond(200, {});

                location.path('/support_home/tickets');
                httpBackend.flush();
                scope.$apply();
                expect(state.current.name).toEqual('supportHome.tickets');
            });
        });


        describe('$scope.getPendingTicket', function () {
            it('should be defined', function () {
                expect(SupportController).toBeDefined();
                expect(scope).toBeDefined();
                expect(httpBackend).toBeDefined();
                expect(SupportService).toBeDefined();
            });

            it('sets $scope.pendingTickets', function () {
                httpBackend
                    .when('GET', '/assets/support/support_home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/support/support_pending_tickets.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/supports/get_pending_tickets.json')
                    .respond(200, {data: ['bar']});

                scope.getPendingTicket();
                httpBackend.flush();
                expect(state.go).toHaveBeenCalled();
                rootScope.$apply();
                expect(scope.pendingTickets).toBeDefined();
                expect(scope.pendingTickets.length).toBeGreaterThan(0);
            })
        })
    });

    describe('Support Service', function () {
        var SupportService;
        var httpBackend;

        beforeEach(inject(function (_SupportService_, _$q_, _$httpBackend_) {
            SupportService = _SupportService_;
            httpBackend = _$httpBackend_;
        }));

        it('should exists', function () {
            expect(SupportService).toBeDefined();
        });

        describe('.getPendingTicket()', function () {
            it('does exists', function () {
                expect(SupportService.getPendingTicket).toBeDefined();
            });

            it('does get pending tickets', function () {
                httpBackend
                    .when('GET', '/assets/support/support_home.html')
                    .respond(200, {foo: 'bar'});

                httpBackend
                    .when('GET', '/assets/support/support_pending_tickets.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/supports/get_pending_tickets.json')
                    .respond(200, {foo: 'bar'});

                SupportService.getPendingTicket().then(function (response) {
                    expect(response).not.toEqual(undefined);
                    expect(response.status).toEqual(200);
                    expect(response.data.foo).toEqual('bar');
                });
                httpBackend.flush();
            });
        });

        describe('.processTicket()', function () {
            it('does exists', function () {
                expect(SupportService.processTicket).toBeDefined();
            });
            it('does process pending tickets', function () {
                httpBackend
                    .when('GET', '/assets/support/support_home.html')
                    .respond(200, {foo: 'bar'});

                httpBackend
                    .when('GET', '/assets/support/support_pending_tickets.html')
                    .respond(200, {});

                httpBackend
                    .when('POST', '/supports/process_pending_tickets.json')
                    .respond(201, {status: 'success'});

                SupportService.processTicket().then(function (response) {
                    expect(response).not.toEqual(undefined);
                    expect(response.status).toEqual(201);
                    expect(response.data.status).toEqual('success');
                });
                httpBackend.flush();
            });
        })
    })
})();
