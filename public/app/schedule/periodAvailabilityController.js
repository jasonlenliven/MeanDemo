angular.module('app').controller('periodAvailabilityController', function($scope, mvGroup, mvGroupSchedule, mvMember, NgTableParams, $routeParams) {

  var periodId = $routeParams.id;
  var groupId = $routeParams.groupId;

  mvGroupSchedule.groupScheduleResource.get({id:periodId}, function(data) {
    $scope.period = data;

    $scope.days = getDays(data.startDate, data.endDate);
  });

  mvGroup.get({id:groupId}, function(data) {
    $scope.group = data;
  });

  mvMember.resourceByGroup.query({groupId:groupId}, function(data) {
    $scope.members = data;
  });


  $scope.tableParams = new NgTableParams(
      {page: 1, count: 1}
  );


      function getDays(startDate, endDate) {
    var result = new Array();
    var currentDate = new Date(startDate);
    var stopDate = new Date(endDate);
    while (currentDate <= stopDate) {
      currentDate = new Date(currentDate);
      result.push({day: currentDate.getDate(), name: dayNames[currentDate.getDay()]});
      currentDate = currentDate.setDate(currentDate.getDate() + 1);
    }
    return result;
  }

  var dayNames = new Array(
      'SU','MO', 'TU', 'WE', 'TH', 'FR', 'SA'
  );
})