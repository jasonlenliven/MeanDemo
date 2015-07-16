var WEEKDAY_POINTS = 1;
var WEEKEND_POINTS = 2;

angular.module('app').factory('mvScheduleGenerator', function (mvWorkLoad) {
  var weekdayWorkLoads = [];
  var weekendWorkLoads = new mvWorkLoad();

  var weekdayRanks = [];
  function pickMemberForWeekend(members, day, weekendWorkLoads, schedules){
  };



  function isMemberAvailable(member, nonavailablilities, day) {
    var nonAvailMembers = nonavailablilities[day].value;
    if(nonAvailMembers) {
      for(var i = 0; i < nonAvailMembers.length; i++) {
        if (nonAvailMembers[i].member.id == member.member.id) {
          return false;
        }
      }
    }
    return true;
  };

  return {
    getWeekends: function(year, month) {
      var weekends = [];
      for (var d = new Date(year, month, 1); d < new Date(year, month+1, 1); d.setDate(d.getDate() + 1)) {
        if (d.getDay() == 0 || d.getDay() == 6) {
          weekends.push(d.getDate());
        }
      }
      return weekends;
    },
    assignWeekends: function(weekends, availabilities, nonavailablilities, schedules) {
      // get members with weekend availabilities
      console.log("Assigning weekends");
      for(var i = 0; i < weekends.length; i++) {
        var day = weekends[i] - 1;
        var availMembers =availabilities[day].value;
        if(availMembers.length > 0) {
          if (availMembers.length > 1){
            // if 2 consecutive weekends, assign to the same person (if available)
            var previousWeekend = weekends[i-1] - 1;
            if (previousWeekend && previousWeekend == day - 1) {
              var previousMember = schedules[previousWeekend];
              if(isMemberAvailable(previousMember, nonavailablilities, day)){
                schedules[day] = previousMember;
                weekendWorkLoads.addWeekendWorkLoad(previousMember.member.id);

              }
            }
            if(!schedules[day]) {

            }

          } else {
            var m = availMembers[0];
            if (m) {
              schedules[day] = m;
              weekendWorkLoads.addWeekendWorkLoad(m.member.id);
            }
          }

        }
      }
      return schedules;
    }
  }
})