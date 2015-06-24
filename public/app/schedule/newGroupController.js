angular.module('app').controller('newGroupController', function($scope, mvGroup, notifier, $location) {

  $scope.save = function() {
    var newUserData = {
      name: $scope.name,
      description: $scope.description
    };

    var newGroup = new mvGroup(newUserData);

    newGroup.$save().then(function() {
      notifier.notify('New group created!');
      $location.path('/schedule/groups');
    }, function (response) {
      notifier.error(response.data.reason);
    });
  }
})