(function () {
    "use strict";
    beforeEach(module('CustomerApp'));
    describe('HomeCtrl', function () {
        var httpBackend;
        var CustomerService;
        var scope;
        var HomeController = {};
        var rootScope;
        var state;
        var location;
        beforeEach(inject(function (_$httpBackend_, _CustomerService_, _$state_, _$location_) {
            httpBackend = _$httpBackend_;
            CustomerService = _CustomerService_;
            state = _$state_;
            location = _$location_;
            spyOn(CustomerService, 'getPreviousTickets').and.callThrough();
        }));

        beforeEach(inject(function ($controller, $rootScope, $q){
            scope = $rootScope.$new();
            rootScope = $rootScope;
            HomeController = $controller('HomeCtrl', {$scope: scope, CustomerService: CustomerService});
            spyOn(state, 'go').and.callFake(function (state) {
                console.log('coming to the state')
            });
        }));

        describe('$scope.goToCreateMenu', function () {
            it('should be defined', function () {
                expect(HomeController).toBeDefined();
                expect(scope).toBeDefined();
                expect(httpBackend).toBeDefined();
            });

            it('should go to home.newTicket', function () {
                scope.goToCreateMenu();
                expect(state.go).toHaveBeenCalled();
                expect(state.go).toHaveBeenCalledWith('home.newTicket');
            })

        });

        describe('routes testing', function () {
            it('should go to home', function () {
                httpBackend
                    .when('GET', '/assets/customer/home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/customer/welcome.html')
                    .respond(200, {});

                location.path('/home');
                httpBackend.flush();
                scope.$apply();
                expect(state.current.name).toEqual('home')
            });

            it('should go to home.welcome', function () {
                httpBackend
                    .when('GET', '/assets/customer/home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/customer/welcome.html')
                    .respond(200, {});
                location.path('/home/welcome');
                httpBackend.flush();
                scope.$apply();
                expect(state.current.name).toEqual('home.welcome');
            });

            it('should go to home.tickets', function () {
                httpBackend
                    .when('GET', '/assets/customer/home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/customer/welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/customer/tickets.html')
                    .respond(200, {});

                location.path('/home/tickets');
                httpBackend.flush();
                scope.$apply();
                expect(state.current.name).toEqual('home.tickets');
            });

            it('should go to home.newTicket', function () {
                httpBackend
                    .when('GET', '/assets/customer/home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/customer/welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/customer/new_ticket.html')
                    .respond(200, {});

                location.path('/home/new_ticket');
                httpBackend.flush();
                scope.$apply();
                expect(state.current.name).toEqual('home.newTicket');
            });
        });

        describe('$scope.viewPreviousTickets', function () {
            it('should be defined', function () {
                expect(HomeController).toBeDefined();
                expect(scope).toBeDefined();
                expect(httpBackend).toBeDefined();
            });

            it('sets $scope.previousTickets', function () {
                httpBackend
                    .when('GET', '/assets/customer/home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/customer/welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/customers/get_previous_tickets.json')
                    .respond(200, {data: ['bar']});

                httpBackend
                    .when('GET', '/assets/customer/tickets.html')
                    .respond(200, {});

                expect(scope.viewPreviousTickets).toBeDefined();
                scope.viewPreviousTickets();
                httpBackend.flush();
                expect(state.go).toHaveBeenCalled();
                rootScope.$apply();
                expect(scope.previousTickets).toBeDefined();
                expect(scope.previousTickets.length).toBeGreaterThan(0);
            })
        })
    });


    describe('Customer Service', function () {
        var CustomerService;
        var httpBackend;
        beforeEach(angular.mock.module('CustomerApp', function ($provide) {
            $provide.value('$log', console);
        }));

        beforeEach(inject(function (_CustomerService_, _$q_, _$httpBackend_) {
            CustomerService = _CustomerService_;
            httpBackend = _$httpBackend_;
        }));

        it('should exists', function () {
            expect(CustomerService).toBeDefined();
        });

        describe('.createTicket()', function () {
            it('does exists', function () {
                expect(CustomerService.createTicket).toBeDefined();
            });
            it('does create the ticket', function () {
                httpBackend
                    .when('GET', '/assets/customer/home.html')
                    .respond(200, {});
                httpBackend
                    .when('GET', '/assets/customer/welcome.html')
                    .respond(200, {});
                httpBackend
                    .when('POST', '/customers/create_new_ticket.json')
                    .respond(201, {status: 'success'});
                CustomerService.createTicket().then(function (response) {
                    expect(response).not.toEqual(undefined);
                    expect(response.status).toEqual(201);
                    expect(response.data.status).toEqual("success");
                });
                httpBackend.flush();
            })
        });

        describe('.getPreviousTicket()', function () {
            it('should exists', function () {
                expect(CustomerService.getPreviousTickets).toBeDefined();
            });

            it('does get all the tickets', function () {
                httpBackend
                    .when('GET', '/assets/customer/home.html')
                    .respond(200, {foo: 'bar'});

                httpBackend
                    .when('GET', '/assets/customer/welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/customers/get_previous_tickets.json')
                    .respond(200, {foo: 'bar'});

                CustomerService.getPreviousTickets().then(function (response) {
                    expect(response).not.toEqual(undefined);
                });
                httpBackend.flush();
            })
        })
    })
})();
