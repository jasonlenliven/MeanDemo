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
      .when('/schedule/groupAvailability/:groupId/:year/:month', { templateUrl: '/partials/schedule/group_schedule', controller: 'calendarController'})
      .when('/schedule/memberAvailability/:memberId/:year?/:month?', { templateUrl: '/partials/schedule/member_schedule', controller: 'scheduleController'})
      .when('/schedule/member/:groupId?', { templateUrl: '/partials/schedule/member', controller: 'memberController'})
      .when('/schedule/groups', { templateUrl: '/partials/schedule/groups', controller: 'groupController'})
      .when('/schedule/group_new', { templateUrl: '/partials/schedule/group_new', controller: 'newGroupController'})
      .when('/schedule/member_new', { templateUrl: '/partials/schedule/member_new', controller: 'newMemberController'})
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