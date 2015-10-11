var colors = ['green', 'orange', 'blue', 'black', 'purple', 'DimGray', 'LightPink', 'Plum', 'silver'];

angular.module('app').factory('mvCalendar2', function ($http, identity, $q, mvPeriodAvailability, mvPeriodScheduleGenerator) {
  return {
    getEvents: function(groupId, periodId, memberType, days) {
      var dfd = $q.defer();
      var groupAvailabilities = mvPeriodScheduleGenerator.List({periodId: periodId, memberType: memberType});

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
              start: dayStart.toLocaleString(),
              //end: dayEnd,
              color: 'green',
              allDay: false,
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
              start: dayStart.toLocaleString(),
              //end: dayEnd,
              color: 'purple',
              allDay: false,
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