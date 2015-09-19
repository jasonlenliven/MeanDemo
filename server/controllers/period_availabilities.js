var mongoose = require('mongoose'),
    Member = mongoose.model('Member'),
    PeriodAvailability = mongoose.model('PeriodAvailability');


exports.getPeriodAvailability = function (req, res) {
  var periodId = req.params.periodId;
  var memberId = req.query.memberId;
  var days = req.query.days;

  console.log('Getting Period availability. id: ' + periodId + " memberid: " + memberId);

      PeriodAvailability.findOne({period_id: periodId, 'member.id': memberId}, function (err, periodAvailability) {
        if (err) {
          console.log('Cannot get period availabilities. Period Id: ' + periodId + ", member id: " + memberId);
          res.status(400);
          return res.send({reason: err.toString()});
        }

        if (!periodAvailability) {
          console.log('member availability not found. Creating new avail.');
          Member.findById(memberId, function(err, member) {
            if (err) {
              console.log('Cannot get member id: ' + memberId);
              res.status(400);
              return res.send({reason: err.toString()});
            }

            var emptyAvail = [];
            for (var i = 0; i < days; i++) {
              emptyAvail.push('NA');
            }
            PeriodAvailability.create({
              period_id: periodId,
              member: {
                id: member._id,
                firstName: member.firstName,
                lastName: member.lastName
              },
              availabilities: emptyAvail
            }, function (err, newPeriodAvailability) {
              if (err) {
                //return res.send({reason:err.toString()});
                console.log("Failed to create new period availability. " + err.toString());
              }
              console.log('New member availability created.');
              res.send(newPeriodAvailability);
            });
          });
        } else {
          res.send(periodAvailability);
        }
      });
};


exports.savePeriodAvailability = function (req, res) {
  var periodAvail = req.body;
  console.log('Saving period Availabilities for ' + periodAvail.member.firstName + " " + periodAvail.member.lastName);

  PeriodAvailability.update({_id: periodAvail._id}, periodAvail, function (err, periodAvailability) {
    if (err) {
      console.log(err.toString());
      return res.send({reason: err.toString()});
    }
    console.log("Saved successfully!");
    res.send(periodAvailability);
  })
};
