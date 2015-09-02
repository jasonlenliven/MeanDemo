angular.module('app').controller('newSchedulePeriodController', function($scope, $routeParams, mvGroupSchedule, notifier, $location) {

  $scope.save = function() {
    var newData = {
      startDate: $scope.startDate,
      endDate: $scope.endDate,
      group_id: $routeParams.groupId
    };

    var newGroupSchedulePeriod = new mvGroupSchedule.groupScheduleResource(newData);

    newGroupSchedulePeriod.$save().then(function() {
      notifier.notify('New schedule period created!');
      $location.path('/schedule/schedule_periods/' + $routeParams.groupId);
    }, function (response) {
      notifier.error(response.data.reason);
    });
  }
})