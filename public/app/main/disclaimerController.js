angular.module('app').controller('disclaimerController', function ($scope, $location) {
  $scope.accept = function() {
    $location.path('/schedule/groups');
  };
});