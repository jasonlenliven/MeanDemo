angular.module('app', ['ngResource', 'ngRoute', 'xeditable', 'ui.calendar']);

angular.module('app').config(function ($routeProvider, $locationProvider) {
  var routeRoleChecks = {
    admin: {auth: function(mvAuth) {
      return mvAuth.authorizeCurrentUserForRoute('admin');
    }}
  };

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  $routeProvider
      .when('/', { templateUrl: '/partials/main/main', controller: 'mainController'})
      .when('/schedule/availability/:id?', { templateUrl: '/partials/schedule/member_schedule', controller: 'scheduleController'})
      .when('/schedule/group/:id/:year/:month', { templateUrl: '/partials/schedule/group_schedule', controller: 'calendarController'})
      .when('/schedule/memberAvailability/:memberId/:year?/:month?', { templateUrl: '/partials/schedule/member_schedule', controller: 'scheduleController'})
      .when('/schedule/member', { templateUrl: '/partials/schedule/member', controller: 'memberController'})
      .when('/signup', { templateUrl: '/partials/account/signup', controller: 'signupController'})
      .when('/admin/users', { templateUrl: '/partials/admin/user-list', controller: 'userListController', resolve: routeRoleChecks.admin});
});


angular.module('app').run(function ($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if(rejection === 'not authorized') {
      $location.path('/');
    }
  });
});