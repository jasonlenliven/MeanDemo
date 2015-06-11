var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

angular.module('app').controller('scheduleController', function (
    $scope, $routeParams, $filter, $http, notifier, mvMemberAvailability) {

  var d = new Date();
  var month = d.getMonth();
  var year = d.getFullYear();

  if($routeParams.year) { year = $routeParams.year;}
  if($routeParams.month) { month = $routeParams.month;}

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
});