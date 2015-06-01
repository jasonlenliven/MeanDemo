angular.module('app').controller('signupController', function($scope, mvUser, notifier, mvAuth, $location) {

  $scope.signup = function() {
    var newUserData = {
      username: $scope.email,
      password: $scope.password,
      firstName: $scope.fname,
      lastName: $scope.lname
    };

    mvAuth.createUser(newUserData).then(function() {
      notifier.notify('User account created!');
      $location.path('/');
    }, function (reason) {
      notifier.error(reason);
    })
  };

})