var mongoose = require('mongoose'),
    algorithm = require('./algorithm'),
    Member = mongoose.model('Member'),
    PeriodAvailability = mongoose.model('PeriodAvailability'),
    GroupSchedule = mongoose.model('GroupSchedule');


function generateSchedule(periodAvailabilities, memberType) {
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

  var firstShiftSchedule = algorithm.generate(firstShiftAvail, members, maxConsecutiveDays);
  var secondShiftSchedule;
  if (isNurses) {
    secondShiftSchedule = algorithm.generate(secondShiftAvail, members, maxConsecutiveDays);
  }

  return [firstShiftSchedule, secondShiftSchedule];
};

exports.generatePeriodSchedule = function (req, res) {
  var periodId = req.params.periodId;
  var memberType = req.query.memberType;
  console.log("Generating period schedule using genetic algorithm. Member Type: " + memberType);
  PeriodAvailability.find({period_id: periodId}, function (err, periodAvailabilities) {
    if (err) {
      console.log('Cannot get period availabilities. Period Id: ' + periodId);
      res.status(400);
      return res.send({reason: err.toString()});
    }
    res.send(generateSchedule(periodAvailabilities, memberType));
    //res.send({status: 'OK'});
  });

};