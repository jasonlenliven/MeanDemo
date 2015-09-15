angular.module('app', ['ngResource', 'ngRoute', 'xeditable', 'ui.calendar', 'infinite-scroll']);

angular.module('app').config(function ($routeProvider, $locationProvider) {
  var routeRoleChecks = {
    admin: {auth: function(mvAuth) {
      return mvAuth.authorizeCurrentUserForRoute('admin');
    }},
    group_manager: {auth: function(mvAuth) {
      return mvAuth.authorizeCurrentUserForRoute('group_manager');
    }}
  };

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  $routeProvider
      .when('/', { templateUrl: '/partials/main/main', controller: 'mainController'})
      .when('/disclaimer', { templateUrl: '/partials/main/disclaimer', controller: 'disclaimerController', resolve: routeRoleChecks.group_manager})
      .when('/schedule/availability/:id?', { templateUrl: '/partials/schedule/member_schedule', controller: 'scheduleController', resolve: routeRoleChecks.group_manager})
      .when('/schedule/groupAvailability/:groupId/:year/:month', { templateUrl: '/partials/schedule/group_schedule', controller: 'calendarController', resolve: routeRoleChecks.group_manager})
      .when('/schedule/memberAvailability/:memberId/:year?/:month?', { templateUrl: '/partials/schedule/member_schedule', controller: 'scheduleController', resolve: routeRoleChecks.group_manager})
      .when('/schedule/member/group/:groupId', { templateUrl: '/partials/schedule/member', controller: 'memberController', resolve: routeRoleChecks.group_manager})
      .when('/schedule/member/:id', { templateUrl: '/partials/schedule/member_edit', controller: 'editMemberController', resolve: routeRoleChecks.group_manager})
      .when('/schedule/groups', { templateUrl: '/partials/schedule/groups', controller: 'groupController', resolve: routeRoleChecks.group_manager})
      .when('/schedule/group_new', { templateUrl: '/partials/schedule/group_new', controller: 'newGroupController', resolve: routeRoleChecks.group_manager})
      .when('/schedule/group_edit/:id', { templateUrl: '/partials/schedule/group_edit', controller: 'editGroupController', resolve: routeRoleChecks.group_manager})
      .when('/schedule/member_new', { templateUrl: '/partials/schedule/member_new', controller: 'newMemberController', resolve: routeRoleChecks.group_manager})
      .when('/schedule/schedule_periods/:groupId', { templateUrl: '/partials/schedule/schedule_periods', controller: 'schedulePeriodController', resolve: routeRoleChecks.group_manager})
      .when('/schedule/schedule_period_new/:groupId', { templateUrl: '/partials/schedule/schedule_period_new', controller: 'newSchedulePeriodController', resolve: routeRoleChecks.group_manager})
      .when('/schedule/periodAvailability/:groupId/:id', { templateUrl: '/partials/schedule/periodAvailability', controller: 'periodAvailabilityController', resolve: routeRoleChecks.group_manager})
      .when('/signup', { templateUrl: '/partials/account/signup', controller: 'signupController'})
      .when('/admin/users', { templateUrl: '/partials/admin/user-list', controller: 'userListController', resolve: routeRoleChecks.admin});
});


angular.module('app').run(function ($rootScope, $location, $window) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if(rejection === 'not authorized') {
      $location.path('/');
    }
  });
  $rootScope.goBack = function(){
    $window.history.back();
  };
});