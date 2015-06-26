var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

angular.module('app').controller('scheduleController', function (
    $scope, $routeParams, $filter, $http, notifier, mvMemberAvailability, $location) {

  var d = new Date();
  var month = d.getMonth();
  var year = d.getFullYear();

  if($routeParams.year) { year = parseInt($routeParams.year);}
  if($routeParams.month) { month = parseInt($routeParams.month);}

  $scope.groupId = $routeParams.groupId;

  $scope.memberAvailability = mvMemberAvailability.resource.get(
      { year: year, month: month, memberId: $routeParams.memberId.toString()}, function() {
    $scope.month = monthNames[$scope.memberAvailability.month];
    $scope.year = $scope.memberAvailability.year;
  });

  $scope.saveMemberAvailability = function(memberAvailability) {
    mvMemberAvailability.save(memberAvailability).then(function() {
      notifier.notify('Member availability updated!');
      $scope.memberAvailability = mvMemberAvailability.resource.get(
          { year: $routeParams.year, month:  $routeParams.month, memberId: $routeParams.memberId.toString()}, function() {
        $scope.month = monthNames[$scope.memberAvailability.month];
        $scope.year = $scope.memberAvailability.year;
      });
    }, function (reason) {
      notifier.error(reason);
    });
  };

  $scope.monthNext = function() {
    if (month == 11) {
      year = year + 1;
      month = 0;
    } else {
      month = month + 1;
    }
    var newPath = "/schedule/memberAvailability/" + $routeParams.memberId + "/" + year + "/" + month;
    $location.path(newPath);
  };

  $scope.monthPrev = function() {
    if (month == 0) {
      year = year - 1;
      month = 11;
    } else {
      month = month - 1;
    }
    var newPath = "/schedule/memberAvailability/" + $routeParams.memberId + "/" + year + "/" + month;
    $location.path(newPath);
  }
});