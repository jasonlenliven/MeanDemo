var colors = ['green', 'brown', 'orange', 'blue', 'black', 'purple'];

angular.module('app').factory('mvCalendar', function ($http, identity, $q, mvGroupAvailability) {
  return {
    getEvents: function(groupId, year, month) {
      var dfd = $q.defer();
      var year = parseInt(year);
      var month = parseInt(month);
      var availabilities = mvGroupAvailability.query({groupId: groupId, year: year, month: month});

      availabilities.$promise.then(function (result) {

        var events = [];
        for	(var index = 0; index < 1; index++) {
          //console.log(availabilities[index].member.id);
          var color = colors[index];
          var member = result[index];
          var title = member.member.prefix + ' ' + member.member.lastName;
          var preferWorkDays = member.preferWorkDays[0].split(",");
          for (var j = 0; j < preferWorkDays.length; j++) {
            var dayStart = parseInt(preferWorkDays[j]);
            var dayEnd = dayStart + 1;
            events.push({title: title, start: new Date(year, month, dayStart), end: new Date(year, month, dayEnd), color: color});
          }

        }
        dfd.resolve(events);
        //return events;

      });

      return dfd.promise;
    }
  }
})