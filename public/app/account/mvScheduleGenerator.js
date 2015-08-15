var WEEKDAY_POINTS = 1;
var WEEKEND_POINTS = 2;
var AVAIL_POINTS = 5;
var PREFER_OFF_POINTS = 1;
var NA_POINTS = -100;

angular.module('app').factory('mvScheduleGenerator', function (mvWorkLoad, mvDateHelper) {
  var weekdayWorkLoads = [];
  var weekendWorkLoads = new mvWorkLoad();

  var dayRanks = [];
  var dayCounts = {};
  var averageDayCounts;


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

  function initializeRanks(availabilities, members) {
    var ranks = [];
    for (var i = 0; i < availabilities.length; i++) {
      ranks[i] = [];
      for (var j = 0; j < members.length; j++) {
        ranks[i].push({'key': members[j].id, 'value': 0});
      }
    }
    return ranks;
  }

  function initializeDayCounts(members) {
    for (var i = 0; i < members.length; i++) {
      dayCounts[members[i].id] = 0;
    }
    return dayCounts;
  }

  function findByKey(arr, key) {
    for(var j=0; j < arr.length; j++) {
      if (arr[j].key == key) {
        return j;
      }
    }
    return -1;
  }

  function calculateRank(ranks, availabilities, nonavailablilities, preferOffDays) {

    for(var i= 0; i < nonavailablilities.length; i++) {
      if (!ranks[i]) {
        ranks[i] = [];
      }

      var na = nonavailablilities[i]? nonavailablilities[i].value : null;
      if (na) {
        for(var j=0; j < na.length; j++) {
          var id = na[j].id;
          var index = findByKey(ranks[i], id);
          if (index >= 0) {
            ranks[i][index].value += NA_POINTS;
          } else{
            ranks[i].push({key:id, value: NA_POINTS});
          }
          sortRanks(ranks[i]);
        }
      }

      var avail = availabilities[i]? availabilities[i].value : null;
      if (avail) {
        for(var j=0; j < avail.length; j++) {
          var id = avail[j].id;
          var index = findByKey(ranks[i], id);
          if (index >= 0) {
            ranks[i][index].value += AVAIL_POINTS;
          } else{
            ranks[i].push({key:id, value: 0});
          }
          sortRanks(ranks[i]);
        }
      }

      var preferOff = preferOffDays[i]? preferOffDays[i].value : null;
      if (preferOff) {
        for(var j=0; j < preferOff.length; j++) {
          var id = preferOff[j].id;
          var index = findByKey(ranks[i], id);
          if (index >= 0) {
            ranks[i][index].value -= PREFER_OFF_POINTS;
          }
          sortRanks(ranks[i]);
        }
      }
    }

    return ranks;
  }

  function sortRanks(ranks) {
    ranks.sort(function(a,b){
      return b.value - a.value;
    });

    return ranks;
  }

  function getMember(members, memberId) {
    for(var i = 0; i < members.length; i++) {
      if (members[i].id == memberId) {
        return members[i];
      }
    }
    return null;
  }

  function incrementRank(member, value, startIndex) {
    for(var i = startIndex; i < dayRanks.length; i++) {
      var index = findByKey(dayRanks[i], member.id);
      dayRanks[i][index].value = dayRanks[i][index].value + value;
      sortRanks(dayRanks[i]);
    }
  }



  function updateRanks(member, date) {
    dayCounts[member.id]++;

    // if work 2 consecutives week end, decrement rank
    if (mvDateHelper.isWeekend(date)){
      var nextDate = new Date();
      nextDate.setDate(date.getDate() + 1);
      if (!mvDateHelper.isWeekend(nextDate)) {
        incrementRank(member, -1, date.getDay());
      }
    }

    // if work enough days, decrement rank
    if(dayCounts[member.id] >= averageDayCounts) {
      incrementRank(member, -1, date.getDay());
    }
  }

  function generateSchedule(availabilities, nonavailablilities, preferOffDays, schedules, members, year, month) {
    dayRanks = initializeRanks(availabilities, members);
    dayCounts = initializeDayCounts(members);
    dayRanks = calculateRank(dayRanks, availabilities, nonavailablilities, preferOffDays);
    averageDayCounts = (new Date(year, month, 0)).getDate() / members.length;

    for(var i = 0; i < availabilities.length; i++) {
      if(dayRanks[i][0] && dayRanks[i][0].value > 0) {
        var memberId = dayRanks[i][0].key;
        if (memberId) {
          schedules[i] = getMember(members, memberId);
          updateRanks(schedules[i], new Date(year, month, i + 1));
        }
      }
    }
    return schedules;
  }

  return {
    calculateRank: calculateRank,
    sortRanks: sortRanks,
    initializeRanks: initializeRanks,
    generateSchedule: generateSchedule,
    assignWeekends: function(weekends, availabilities, nonavailablilities, schedules, memberCounts) {
      dayRanks = calculateRank(dayRanks, availabilities, nonavailablilities);
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
                weekendWorkLoads.addWeekendWorkLoad(previousMember.id);

              }
            }
            if(!schedules[day]) {

            }

          } else {
            var m = availMembers[0];
            if (m) {
              schedules[day] = m;
              weekendWorkLoads.addWeekendWorkLoad(m.id);
            }
          }

        }
      }
      return schedules;
    }
  }
})