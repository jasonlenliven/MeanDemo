var mongoose = require('mongoose'),
    Member = mongoose.model('Member'),
    PeriodAvailability = mongoose.model('PeriodAvailability'),
    GroupSchedule = mongoose.model('GroupSchedule');

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
    }
  });
  return candidate;
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

  console.log(firstShiftAvail);
  console.log(secondShiftAvail);

  var firstShiftSchedule = generateRandomSchedule(firstShiftAvail, members);
  var secondShiftSchedule = generateRandomSchedule(secondShiftAvail, members);

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