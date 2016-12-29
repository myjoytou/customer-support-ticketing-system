/**
 * Created by infibam on 29/12/16.
 */
(function () {
    "use strict";

    beforeEach(module('AdminApp'));
    describe('AdminCtrl', function () {
        var httpBackend;
        var AdminService;
        var scope;
        var AdminController = {};
        var rootScope;
        var state;
        var location;
        beforeEach(inject(function (_$httpBackend_, _AdminService_, _$state_, _$location_) {
            httpBackend = _$httpBackend_;
            AdminService = _AdminService_;
            state = _$state_;
            location = _$location_;
            spyOn(AdminService, 'getPendingTicket').and.callThrough();
            spyOn(AdminService, 'processTicket').and.callThrough();
        }));

        beforeEach(inject(function ($controller, $rootScope, $q){
            scope = $rootScope.$new();
            rootScope = $rootScope;
            AdminController = $controller('AdminCtrl', {$scope: scope, AdminService: AdminService});
            spyOn(state, 'go').and.callFake(function (state) {
                console.log('coming to the state')
            });
        }));

        describe('routes testing', function () {
            it('should go to home', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                location.path('/admin_home');
                httpBackend.flush();
                scope.$apply();
                expect(state.current.name).toEqual('adminHome')
            });

            it('should go to home.welcome', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                location.path('/admin_home/welcome');
                httpBackend.flush();
                scope.$apply();
                expect(state.current.name).toEqual('adminHome.welcome');
            });

            it('should go to home.tickets', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/admin/admin_pending_tickets.html')
                    .respond(200, {});

                location.path('/admin_home/tickets');
                httpBackend.flush();
                scope.$apply();
                expect(state.current.name).toEqual('adminHome.tickets');
            });

            it('should go to home.users', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/admin/user_list.html')
                    .respond(200, {});


                location.path('/admin_home/users');
                httpBackend.flush();
                scope.$apply();
                expect(state.current.name).toEqual('adminHome.users');
            });
        });


        describe('$scope.getPendingTicket', function () {
            it('should be defined', function () {
                expect(AdminController).toBeDefined();
                expect(scope).toBeDefined();
                expect(httpBackend).toBeDefined();
                expect(AdminService).toBeDefined();
            });

            it('sets $scope.pendingTickets', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/admin/admin_pending_tickets.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/admins/get_pending_tickets.json')
                    .respond(200, {data: ['bar']});

                scope.getPendingTicket();
                httpBackend.flush();
                expect(state.go).toHaveBeenCalled();
                rootScope.$apply();
                expect(scope.pendingTickets).toBeDefined();
                expect(scope.pendingTickets.length).toBeGreaterThan(0);
            })
        });

        describe('$scope.getAllUsers', function () {
            it('should be defined', function () {
                expect(AdminController).toBeDefined();
                expect(scope).toBeDefined();
                expect(httpBackend).toBeDefined();
                expect(AdminService).toBeDefined();
            });

            it('sets $scope.pendingTickets', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/assets/admin/admin_pending_tickets.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/admins/get_all_users.json')
                    .respond(200, {data: ['bar']});

                scope.getAllUsers();
                httpBackend.flush();
                expect(state.go).toHaveBeenCalled();
                rootScope.$apply();
                expect(scope.userList).toBeDefined();
                expect(scope.userList.length).toBeGreaterThan(0);
            })
        })
    });

    describe('Admin Service', function () {
        var AdminService;
        var httpBackend;

        beforeEach(inject(function (_AdminService_, _$q_, _$httpBackend_) {
            AdminService = _AdminService_;
            httpBackend = _$httpBackend_;
        }));

        it('should exists', function () {
            expect(AdminService).toBeDefined();
        });

        describe('.getPendingTicket()', function () {
            it('does exists', function () {
                expect(AdminService.getPendingTicket).toBeDefined();
            });

            it('does get pending tickets', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {foo: 'bar'});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/admins/get_pending_tickets.json')
                    .respond(200, {foo: 'bar'});

                AdminService.getPendingTicket().then(function (response) {
                    expect(response).not.toEqual(undefined);
                    expect(response.status).toEqual(200);
                    expect(response.data.foo).toEqual('bar');
                });
                httpBackend.flush();
            });
        });

        describe('.processTicket()', function () {
            it('does exists', function () {
                expect(AdminService.processTicket).toBeDefined();
            });
            it('does process pending tickets', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {foo: 'bar'});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('POST', '/admins/process_pending_tickets.json')
                    .respond(201, {status: 'success'});

                AdminService.processTicket().then(function (response) {
                    expect(response).not.toEqual(undefined);
                    expect(response.status).toEqual(201);
                    expect(response.data.status).toEqual('success');
                });
                httpBackend.flush();
            });
        });

        describe('.getAllUsers()', function () {
            it('does exists', function () {
                expect(AdminService.getAllUsers).toBeDefined();
            });
            it('does process pending tickets', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {foo: 'bar'});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('GET', '/admins/get_all_users.json')
                    .respond(201, {status: 'success'});

                AdminService.getAllUsers().then(function (response) {
                    expect(response).not.toEqual(undefined);
                    expect(response.status).toEqual(201);
                    expect(response.data.status).toEqual('success');
                });
                httpBackend.flush();
            });
        });

        describe('.activateUser()', function () {
            it('does exists', function () {
                expect(AdminService.activateUser).toBeDefined();
            });
            it('does process pending tickets', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {foo: 'bar'});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('POST', '/admins/activate_user.json')
                    .respond(201, {status: 'success'});

                AdminService.activateUser().then(function (response) {
                    expect(response).not.toEqual(undefined);
                    expect(response.status).toEqual(201);
                    expect(response.data.status).toEqual('success');
                });
                httpBackend.flush();
            });
        });

        describe('.deactivateUser()', function () {
            it('does exists', function () {
                expect(AdminService.deactivateUser).toBeDefined();
            });
            it('does process pending tickets', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {foo: 'bar'});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('POST', '/admins/deactivate_user.json')
                    .respond(201, {status: 'success'});

                AdminService.deactivateUser().then(function (response) {
                    expect(response).not.toEqual(undefined);
                    expect(response.status).toEqual(201);
                    expect(response.data.status).toEqual('success');
                });
                httpBackend.flush();
            });
        });

        describe('.assignSupportRoleToUser()', function () {
            it('does exists', function () {
                expect(AdminService.assignSupportRoleToUser).toBeDefined();
            });
            it('does process pending tickets', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {foo: 'bar'});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('POST', '/admins/assign_support_role.json')
                    .respond(201, {status: 'success'});

                AdminService.assignSupportRoleToUser().then(function (response) {
                    expect(response).not.toEqual(undefined);
                    expect(response.status).toEqual(201);
                    expect(response.data.status).toEqual('success');
                });
                httpBackend.flush();
            });
        });

        describe('.denySupportRoleToUser()', function () {
            it('does exists', function () {
                expect(AdminService.denySupportRoleToUser).toBeDefined();
            });
            it('does process pending tickets', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {foo: 'bar'});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('POST', '/admins/deny_support_role.json')
                    .respond(201, {status: 'success'});

                AdminService.denySupportRoleToUser().then(function (response) {
                    expect(response).not.toEqual(undefined);
                    expect(response.status).toEqual(201);
                    expect(response.data.status).toEqual('success');
                });
                httpBackend.flush();
            });
        });


        describe('.assignAdminRoleToUser()', function () {
            it('does exists', function () {
                expect(AdminService.assignAdminRoleToUser).toBeDefined();
            });
            it('does process pending tickets', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {foo: 'bar'});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('POST', '/admins/assign_admin_role.json')
                    .respond(201, {status: 'success'});

                AdminService.assignAdminRoleToUser().then(function (response) {
                    expect(response).not.toEqual(undefined);
                    expect(response.status).toEqual(201);
                    expect(response.data.status).toEqual('success');
                });
                httpBackend.flush();
            });
        });

        describe('.denyAdminRoleToUser()', function () {
            it('does exists', function () {
                expect(AdminService.denyAdminRoleToUser).toBeDefined();
            });
            it('does process pending tickets', function () {
                httpBackend
                    .when('GET', '/assets/admin/admin_home.html')
                    .respond(200, {foo: 'bar'});

                httpBackend
                    .when('GET', '/assets/admin/admin_welcome.html')
                    .respond(200, {});

                httpBackend
                    .when('POST', '/admins/deny_admin_role.json')
                    .respond(201, {status: 'success'});

                AdminService.denyAdminRoleToUser().then(function (response) {
                    expect(response).not.toEqual(undefined);
                    expect(response.status).toEqual(201);
                    expect(response.data.status).toEqual('success');
                });
                httpBackend.flush();
            });
        });
    })
})();

