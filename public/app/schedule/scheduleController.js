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
    memberAvailability.preferWorkDays = mvMemberAvailability.splitString(memberAvailability.preferWorkDays);
    memberAvailability.preferOffDays = mvMemberAvailability.splitString(memberAvailability.preferOffDays);
    memberAvailability.noWorkDays = mvMemberAvailability.splitString(memberAvailability.noWorkDays);

    var overLapDays = mvMemberAvailability.checkDays(memberAvailability);
    if (overLapDays.length) {
      //alert('Days cannot overlap. The following days appear in more than one field: ' + overLapDays.toString());
      $scope.availabilityForm.$setError('preferWorkDays', 'Days cannot overlap. The following days appear in more than one field: ' + overLapDays.toString());
      //memberAvailability.preventDefault();
      //return false;
    } else {

      mvMemberAvailability.save(memberAvailability).then(function () {
        notifier.notify('Member availability updated!');
        $scope.memberAvailability = mvMemberAvailability.resource.get(
            {
              year: $routeParams.year,
              month: $routeParams.month,
              memberId: $routeParams.memberId.toString()
            }, function () {
              $scope.month = monthNames[$scope.memberAvailability.month];
              $scope.year = $scope.memberAvailability.year;
            });
      }, function (reason) {
        notifier.error(reason);
      });
    }
  };

  $scope.checkData = function (data, name) {
    var days = [];
    if (data && data.length ) {
      if (data.constructor === Array) {
        days = data;
      } else {
        days = data.split(/[\s,]+/);
      }
      for (var i = 0; i < days.length; i++) {
        var d = parseInt(days[i]);
        if (!d) {
          return "Invalid day.";
        }
        var maxDay = (new Date(year, month + 1, 0)).getDate();
        if (d > maxDay) {
          return "Max day for this month is " + maxDay;
        }
      }
    }

    var daysToCompare;
    switch(name) {
      case 'preferWorkDays':
        daysToCompare = $("[name='noWorkDays']").val().concat($("[name='preferOffDays']").val()).split(/[\s,]+/);
        break;
      case 'noWorkDays':
        daysToCompare = $("[name='preferWorkDays']").val().concat($("[name='preferOffDays']").val()).split(/[\s,]+/);
        break;
      case 'preferOffDays':
        daysToCompare = $("[name='noWorkDays']").val().concat($("[name='preferWorkDays']").val()).split(/[\s,]+/);
        break;
    }

    var overLapDays = days.filter(function(val) {
      return daysToCompare.indexOf(val) > -1;
    });
    if (overLapDays.length) {
      return 'preferWorkDays', 'Days cannot overlap. The following days appear in more than one field: ' + overLapDays.toString();
    }
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