angular.module('app').controller('navbarLoginController', function ($scope, $http, identity, notifier, mvAuth, $location) {
  $scope.identity = identity;
  $scope.signin = function(username, password) {
    mvAuth.authenticateUser(username, password).then(function(success) {
      if(success) {
        notifier.notify('You have successfully signed in!');
        $location.path('/disclaimer');
      } else {
        notifier.notify('Invalid username/password.');
      }
    })
  }

  $scope.signout = function() {
    mvAuth.logoutUser().then(function() {
      $scope.username = "";
      $scope.password = "";
      notifier.notify('You have successfully signed out!');
      $location.path('/')
    })
  }
});