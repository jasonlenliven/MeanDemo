angular.module('app').controller('editGroupController', function($scope, mvGroup, notifier, $location, $routeParams) {
  var group = mvGroup.get({id:$routeParams.id.toString()}, function() {
    $scope.name = group.name;
    $scope.description = group.description;
    $scope.manager_first_name = group.manager_first_name;
    $scope.manager_last_name = group.manager_last_name;
    $scope.manager_email = group.manager_email;
    $scope.manager_phone = group.manager_phone;
  });

  $scope.update = function() {
    var newUserData = {
      name: $scope.name,
      description: $scope.description,
      manager_first_name: $scope.manager_first_name,
      manager_last_name: $scope.manager_last_name,
      manager_email: $scope.manager_email,
      manager_phone: $scope.manager_phone
    };

    var newGroup = new mvGroup(newUserData);

    newGroup.$update({id:$routeParams.id}).then(function() {
      notifier.notify('Successfully updated group!');
      $location.path('/schedule/groups');
    }, function (response) {
      notifier.error(response.data.reason);
    });
  }
})