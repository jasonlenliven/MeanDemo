angular.module('app').controller('groupController', function($scope, mvGroup, notifier) {

  $scope.groups = mvGroup.query();

  $scope.delete = function(item) {
    var groupToDelete = item;

    groupToDelete.$remove().then(function() {
      notifier.notify('Group deleted!');
      $scope.groups.splice($scope.groups.indexOf(item), 1);
    }, function (response) {
      notifier.error(response.data.reason);
    });
  }

})