var colors = ['green', 'orange', 'blue', 'black', 'purple', 'DimGray', 'LightPink', 'Plum', 'silver'];

angular.module('app').factory('mvCalendar', function ($http, identity, $q, mvGroupAvailability, mvScheduleGenerator, mvDateHelper) {
  return {
    getEvents: function(groupId, year, month) {
      var dfd = $q.defer();
      var year = parseInt(year);
      var month = parseInt(month);
      var groupAvailabilities = mvGroupAvailability.query({groupId: groupId, year: year, month: month});


      var weekends = mvDateHelper.getWeekends(year, month);
      console.log(weekends);

      var availabilities = [];
      var nonavailabilities = [];
      var lastDayInMonth = (new Date(year, month + 1, 0)).getDate();
      var schedules = new Array(lastDayInMonth);
      for(var i = 0; i < lastDayInMonth; i++) {
        availabilities.push({key:i, value:[]});
        nonavailabilities.push({key:i, value:[]});
      }

      groupAvailabilities.$promise.then(function (result) {

        var events = [];
        var members= [];
        for	(var index = 0; index < result.length; index++) {

          //console.log(availabilities[index].member.id);
          var color = 'green'//colors[index];
          var naColor = 'red';
          var member = result[index];
          members.push(member.member);
          var title = member.member.prefix + ' ' + member.member.lastName;
          if (member.preferWorkDays) {
            var preferWorkDays = member.preferWorkDays;

            for (var j = 0; j < preferWorkDays.length; j++) {
              var dayStart = parseInt(preferWorkDays[j]);
              var dayEnd = dayStart + 1;
              events.push({
                title: title,
                start: new Date(year, month, dayStart),
                end: new Date(year, month, dayEnd),
                color: 'orange'
              });

              availabilities[dayStart-1].value.push(member.member);
            }
          }
          if (member.noWorkDays) {
            var notAvailDays = member.noWorkDays;
            for (var j = 0; j < notAvailDays.length; j++) {
              var dayStart = parseInt(notAvailDays[j]);
              var dayEnd = dayStart + 1;
              events.push({
                title: title,
                start: new Date(year, month, dayStart),
                end: new Date(year, month, dayEnd),
                color: naColor
              });

              nonavailabilities[dayStart-1].value.push(member.member);
            }
          }


        }
        //schedules = mvScheduleGenerator.assignWeekends(weekends, availabilities, nonavailabilities, schedules, memberCounts);
        schedules = mvScheduleGenerator.generateSchedule(availabilities, nonavailabilities, schedules, members, year, month);
        for (var j = 0; j < schedules.length; j++) {
          var member = schedules[j];

          if (member) {
            var dayStart = j + 1;
            var dayEnd = dayStart + 1;
            var title = member.prefix + ' ' + member.lastName;
            events.push({
              title: title,
              start: new Date(year, month, dayStart),
              end: new Date(year, month, dayEnd),
              color: color
            });
          }


        }
        dfd.resolve(events);
        //return events;

      });

      return dfd.promise;
    }
  }
})