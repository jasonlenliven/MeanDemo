var mongoose = require('mongoose'),
    Member = mongoose.model('Member'),
    PeriodAvailability = mongoose.model('PeriodAvailability');



exports.generatePeriodSchedule = function (req, res) {
  var periodId = req.params.periodId;
  console.log("Generating period schedule using genetic algorithm.");
  PeriodAvailability.find({period_id: periodId}, function (err, periodAvailability) {
    if (err) {
      console.log('Cannot get period availabilities. Period Id: ' + periodId);
      res.status(400);
      return res.send({reason: err.toString()});
    }

    res.send({status: 'OK'});
  });

};