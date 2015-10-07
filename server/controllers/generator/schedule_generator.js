var mongoose = require('mongoose'),
    Member = mongoose.model('Member'),
    PeriodAvailability = mongoose.model('PeriodAvailability'),
    GroupSchedule = mongoose.model('GroupSchedule');

var dayCounts = [];

function generate(firstShiftAvail, secondShiftAvail) {
  var daysCount = firstShiftAvail.length;

  var candidate = new Array(daysCount);


}

function generateRandomSchedule(avails, members) {
  var daysCount = avails.length;
  var candidate = new Array(daysCount);
  avails.forEach(function (availability, index) {
    if (availability.length) {
      var max = availability.length - 1;
      candidate[index] = (availability[Math.floor(Math.random() * max)]);
      dayCounts[candidate[index].id]++;
    }
  });
  return candidate;
}

function initializeDayCounts(members) {
  for (var i = 0; i < members.length; i++) {
    dayCounts[members[i].id] = 0;
  }
  return dayCounts;
}

function getFitness(schedule, members) {
  var score = 100;
  var memberCount = members.length;
  var days = schedule.length;
  var averageWorkingDays =  days / memberCount;
  console.log("Member Count: " + memberCount);
  console.log("days: " + days);
  console.log("Average days: " + averageWorkingDays);

  for (var i=0; i < schedule.length; i++) {
    var currentWorker = schedule[i];
    if (i < (schedule.length - 2)) {
      var nextDayWorker = schedule[i+1];
      var nextNextDayWorker = schedule[i+2];
      if (currentWorker && currentWorker.id && nextDayWorker && nextNextDayWorker &&
          ((currentWorker.id == nextDayWorker.id) && (currentWorker.id  == nextNextDayWorker.id))) {
        if (i < (schedule.length - 3)) {
          var nextNextNextDayWorker = schedule[i+3];
          if (nextNextNextDayWorker && (currentWorker.id == nextNextNextDayWorker.id)) {
            console.log("Working more than 3 days in a row. " + currentWorker.firstName + " " + currentWorker.lastName);
            score -= 10;
          } else {
            console.log("Working 3 days in a row. " + currentWorker.firstName + " " + currentWorker.lastName);
            score += 1;
          }
        } else {
          console.log("Working 3 days in a row. " + currentWorker.firstName + " " + currentWorker.lastName);
          score +=1;
        }
      }
    }
  }


  for (var i=0; i < schedule.length - 7; i++) {
    var map = {};
    for (var j = i; j <= i + 6; j++) {
      var member = schedule[j];
      if (member && member.id) {
        if (map[member.id]) {
          map[member.id]++;
          if (map[member.id] == 4) {
            console.log("Working more than 3 days in week. " + member.id + ". "  + member.firstName + " " + member.lastName);
            score -= 20;
          }
        } else {
          map[member.id] = 1;
        }
      }
    }

  }

  console.log("daysCount: " + dayCounts);
  if (averageWorkingDays > 3) {
    for (var i = 0; i < memberCount; i++) {
      if (dayCounts[members[i].id] >= (averageWorkingDays - 1)) {
        console.log("Working more than average. " + members[i].firstName + " " + members[i].lastName);
        score -= 10;
      }
    }
  }
  return score;
}


function generateSchedule(periodAvailabilities) {
  var members = [];
  var daysCount = periodAvailabilities[0].availabilities.length;
  var firstShiftAvail = [];
  var secondShiftAvail = [];
  for (var i = 0; i < daysCount; i++) {
    firstShiftAvail.push([]);
    secondShiftAvail.push([]);
  }
  periodAvailabilities.forEach(function (pa) {
    members.push(pa.member);
    for (var i = 0; i < daysCount; i++) {
      if (pa.availabilities[i] == 'AM') {
        firstShiftAvail[i].push(pa.member);
      } else if (pa.availabilities[i] == 'PM') {
        secondShiftAvail[i].push(pa.member);
      }
    }
  });

  //console.log(firstShiftAvail);
  //console.log(secondShiftAvail);

  initializeDayCounts(members);

  var firstShiftSchedule = generateRandomSchedule(firstShiftAvail, members);
  var secondShiftSchedule = generateRandomSchedule(secondShiftAvail, members);

  console.log("Fitness = " + getFitness(firstShiftSchedule, members));
  console.log("Fitness = " + getFitness(secondShiftSchedule, members));

  return [firstShiftSchedule, secondShiftSchedule];
  //GroupSchedule.findById(periodAvailabilities[0].period_id, function(err, period) {
  //  var days = getDays(period.startDate, period.endDate);
  //  var periodLength = days.length;
  //  console.log('Period length: ' + periodLength);
  //
  //});

};

exports.generatePeriodSchedule = function (req, res) {
  var periodId = req.params.periodId;
  console.log("Generating period schedule using genetic algorithm.");
  PeriodAvailability.find({period_id: periodId}, function (err, periodAvailabilities) {
    if (err) {
      console.log('Cannot get period availabilities. Period Id: ' + periodId);
      res.status(400);
      return res.send({reason: err.toString()});
    }
    res.send(generateSchedule(periodAvailabilities));
    //res.send({status: 'OK'});
  });

};