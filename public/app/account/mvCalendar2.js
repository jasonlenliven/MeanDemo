var colors = ['green', 'orange', 'blue', 'black', 'purple', 'DimGray', 'LightPink', 'Plum', 'silver'];

angular.module('app').factory('mvCalendar2', function ($http, identity, $q, mvPeriodAvailability, algorithm, mvGroupSchedule, notifier) {

  function generateSchedule(periodAvailabilities, memberType, period) {
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

    if (period && period.am_schedule) {
       firstShiftSchedule = algorithm.generate(firstShiftAvail, members, maxConsecutiveDays, period.am_schedule);
    } else {
      firstShiftSchedule = algorithm.generate(firstShiftAvail, members, maxConsecutiveDays);
    }
    
    if (isNurses) {
      if (period && period.pm_schedule) {
        secondShiftSchedule = algorithm.generate(secondShiftAvail, members, maxConsecutiveDays, period.pm_schedule);
      } else {
      
        secondShiftSchedule = algorithm.generate(secondShiftAvail, members, maxConsecutiveDays);
      }
    }

    return [firstShiftSchedule, secondShiftSchedule];
  }

  function populateEvents(schedule, amPm, days) {
    var events = [];
    var color = '';
    var startHour  = 0;
    var endHour  = 0;
    if (amPm == 'am') {
      color = 'green';
      startHour = 0;
      endHour = 19;
    } else if (amPm == 'pm') {
      color = 'purple';
      startHour = 19;
      endHour = 23;
    }

    angular.forEach(schedule, function(member, j) {

      if (member) {
        var dayStart = new Date(days[j]);
        dayStart.setHours(startHour);
        var dayEnd = new Date(days[j]);
        dayEnd.setHours(endHour);
        var title = member.firstName + ' ' + member.lastName;

        events.push({
          title: title,
          start: dayStart.toLocaleString(),
          //end: dayEnd,
          color: color,
          allDay: false,
          stick : true
        });
      }
    });
    return events;
  }

  function saveSchedule(period) {
    var groupSchedule = new mvGroupSchedule.groupScheduleResource(period);

    groupSchedule.$update({_id:period.id}).then(function() {
      notifier.notify('Schedule has successfully generated!');
    }, function (response) {
      notifier.error(response.data.reason);
    });
  }

  function doGenerate() {

  }

  return {
    getEvents: function(groupId, period, memberType, days) {
      var dfd = $q.defer();
      var amSchedule = [];
      var pmSchedule = [];
      var events = [];
      if (period.am_schedule.length){
        amSchedule = period.am_schedule;
        events = populateEvents(amSchedule, 'am', days);
        if (period.pm_schedule.length) {
          pmSchedule = period.pm_schedule;
          events = events.concat(populateEvents(pmSchedule, 'pm', days));
        }
        dfd.resolve(events);
      } else {
        var groupAvailabilities = mvPeriodAvailability.resource.get({periodId: period._id});

        groupAvailabilities.$promise.then(function (avails) {
          var result = generateSchedule(avails, memberType);

          amSchedule = result[0];
          pmSchedule = result[1];
          events = populateEvents(amSchedule, 'am', days);
          period.am_schedule = amSchedule;
          if (pmSchedule) {
            events = events.concat(populateEvents(pmSchedule, 'pm', days));
            period.pm_schedule = pmSchedule;
          }

          saveSchedule(period);

          dfd.resolve(events);
        });
      }

      return dfd.promise;
    },
    regenerate: function (groupId, period, memberType, days, updateOnly) {
      var dfd = $q.defer();
      var amSchedule = [];
      var pmSchedule = [];
      var events = [];
      var groupAvailabilities = mvPeriodAvailability.resource.get({periodId: period._id});

      groupAvailabilities.$promise.then(function (avails) {
        var result;
        if (updateOnly) {
          result = generateSchedule(avails, memberType, period);
        } else {
          result = generateSchedule(avails, memberType);
        }
        
        amSchedule = result[0];
        pmSchedule = result[1];
        events = populateEvents(amSchedule, 'am', days);
        period.am_schedule = (amSchedule);
        if (pmSchedule) {
          events = events.concat(populateEvents(pmSchedule, 'pm', days));
          period.pm_schedule = (pmSchedule);
        }

        saveSchedule(period);

        dfd.resolve(events);
      });
      return dfd.promise;
    }
  }
});