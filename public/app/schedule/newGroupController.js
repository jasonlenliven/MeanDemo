angular.module('app').controller('newGroupController', function($scope, mvGroup, notifier, $location) {

  $scope.save = function() {
    var newUserData = {
      name: $scope.name,
      description: $scope.description,
      manager_first_name: $scope.manager_first_name,
      manager_last_name: $scope.manager_last_name,
      manager_email: $scope.manager_email,
      manager_phone: $scope.manager_phone
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