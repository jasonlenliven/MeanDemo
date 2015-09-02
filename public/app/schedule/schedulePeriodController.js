angular.module('app').controller('schedulePeriodController', function($scope, mvGroupSchedule, notifier, $window, $routeParams) {

  $scope.groupId = $routeParams.groupId;
  console.log("Schedule periods for group: " + $routeParams.groupId);
  $scope.periods = mvGroupSchedule.groupSchedulesResourceByGroup.query({groupId:$routeParams.groupId});

  $scope.delete = function(item) {
    if ($window.confirm('Are you sure you want to delete this schedule period?')) {

      mvGroupSchedule.groupScheduleResource.get({ id:item._id }, function(period) {
        period.$remove().then(function () {
          notifier.notify('Schedule period deleted!');
          $scope.periods.splice($scope.periods.indexOf(item), 1);
        }, function (response) {
          notifier.error(response.data.reason);
        });
      })
    }
  }
})