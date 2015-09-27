angular.module('app').controller('periodAvailabilityController',
    function ($scope, mvGroup, mvGroupSchedule, mvMember, $routeParams, mvPeriodAvailability, $location, $q, notifier) {

      var periodId = $routeParams.id;
      var groupId = $routeParams.groupId;


      mvGroup.get({id: groupId}, function (group) {
        $scope.group = group;
        mvMember.resourceByGroup.query({groupId: groupId}, function (members) {
          $scope.members = members;
          mvGroupSchedule.groupScheduleResource.get({id: periodId}, function (period) {
            $scope.period = period;

            $scope.days = getDays(period.startDate, period.endDate);
            $scope.periodAvail = [];

            members.forEach(function (member, index) {
              mvPeriodAvailability.resourceByMember.get({
                periodId: $scope.period._id,
                memberId: member._id,
                days: $scope.days.length
              }, function (pa) {
                $scope.periodAvail[index] = pa;
              });

            })

          });
        });
      });


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


      $scope.save = function () {
        var defer = $q.defer();
        var promises = [];
        $scope.periodAvail.forEach(function (pa) {
          if (pa.changed) {
            var saveJob = pa.$save().then(function (data) {
              //$scope.periodAvail[index] = data;
              //console.log("Successfully saved availability for " + data.member.lastName);
            }, function (response) {
              notifier.error(response.data.reason);
            });
            promises.push(saveJob);
          }
        });
        $q.all(promises).then(function () {
          notifier.notify("Member availabilities were saved successfully.");
          $location.path("/schedule/schedule_periods/" + groupId);
        });
      };

      $scope.loadMore = function () {
        var listSize = $scope.members ? $scope.members.length : 0;
        mvMember.resourceByGroup.query({groupId: groupId}, function (data) {
          $scope.members = $scope.members.concat(data);
        });
      };

      var dayNames = new Array(
          'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'
      );
    })