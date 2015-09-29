var colors = ['green', 'orange', 'blue', 'black', 'purple', 'DimGray', 'LightPink', 'Plum', 'silver'];

angular.module('app').factory('mvCalendar2', function ($http, identity, $q, mvPeriodAvailability, mvPeriodScheduleGenerator) {
  return {
    getEvents: function(groupId, periodId, days) {
      var dfd = $q.defer();
      var groupAvailabilities = mvPeriodScheduleGenerator.List({periodId: periodId});

      groupAvailabilities.$promise.then(function (result) {
        var events = [];
        var amSchedule = result[0];
        var pmSchedule = result[1];
        angular.forEach(amSchedule, function(member, j) {

          if (member) {
            var dayStart = new Date(days[j]);
            dayStart.setHours(7);
            var dayEnd = new Date(days[j]);
            dayEnd.setHours(19);
            var title = member.firstName + ' ' + member.lastName;

            events.push({
              title: title,
              start: dayStart,
              end: dayEnd,
              color: 'green',
              stick : true
            });
          }
        });

        angular.forEach(pmSchedule, function(member, j) {

          if (member) {
            var dayStart = new Date(days[j]);
            dayStart.setHours(19);
            var dayEnd = new Date(days[j]);
            dayEnd.setDate(dayEnd.getDate() + 1);
            var title = member.firstName + ' ' + member.lastName;

            events.push({
              title: title,
              start: dayStart,
              end: dayEnd,
              color: 'green',
              stick : true
            });
          }
        });

        dfd.resolve(events);
      });

      return dfd.promise;
    }
  }
})