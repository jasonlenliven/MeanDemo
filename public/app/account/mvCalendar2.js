var colors = ['green', 'orange', 'blue', 'black', 'purple', 'DimGray', 'LightPink', 'Plum', 'silver'];

angular.module('app').factory('mvCalendar2', function ($http, identity, $q, mvPeriodAvailability, algorithm) {

  function generateSchedule(periodAvailabilities, memberType) {
    var firstShiftSchedule = [];
    var secondShiftSchedule = [];
    if (!periodAvailabilities || !periodAvailabilities.length) {
      return [firstShiftSchedule, secondShiftSchedule];
    }

    var members = [];
    var daysCount = periodAvailabilities[0].availabilities.length;
    var firstShiftAvail = [];
    var secondShiftAvail = [];
    var isNurses = memberType == 'Nurses';
    var maxConsecutiveDays = 5;
    if (isNurses) {
      maxConsecutiveDays = 3;
    }
    for (var i = 0; i < daysCount; i++) {
      firstShiftAvail.push([]);
      if (isNurses) {
        secondShiftAvail.push([]);
      }
    }
    periodAvailabilities.forEach(function (pa) {
      members.push(pa.member);
      console.log("pushing member: " + pa.member.lastName);
      for (var i = 0; i < daysCount; i++) {
        if (pa.availabilities[i] == 'AM' || pa.availabilities[i] == 'Y') {
          firstShiftAvail[i].push(pa.member);
        } else if (isNurses && pa.availabilities[i] == 'PM' || pa.availabilities[i] == 'Y') {
          secondShiftAvail[i].push(pa.member);
        }
      }
    });

    firstShiftSchedule = algorithm.generate(firstShiftAvail, members, maxConsecutiveDays);
    if (isNurses) {
      secondShiftSchedule = algorithm.generate(secondShiftAvail, members, maxConsecutiveDays);
    }

    return [firstShiftSchedule, secondShiftSchedule];
  }

  return {
    getEvents: function(groupId, periodId, memberType, days) {
      var dfd = $q.defer();
      var groupAvailabilities = mvPeriodAvailability.resource.get({periodId: periodId});

      groupAvailabilities.$promise.then(function (avails) {
        var result = generateSchedule(avails, memberType);

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