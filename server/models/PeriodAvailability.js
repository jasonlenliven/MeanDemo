var mongoose = require('mongoose');

var periodAvailabilitySchema = mongoose.Schema({
  period_id: {type: String, required:'{PATH} is required'},
  member: {
    id: {type: String, required: '{PATH} is required'},
    firstName: {type: String},
    lastName: {type: String}
  },
  availabilities: [String]
});


var PeriodAvailability = mongoose.model("PeriodAvailability", periodAvailabilitySchema);

function createDefaultPeriodAvailabilities() {
  PeriodAvailability.find({}).exec(function (err, colection) {
    console.log("Checking period avail.");
    if (colection.length === 0) {
      console.log("Creating default period avail.");
      PeriodAvailability.create({
        period_id:'12345',
        member: {
          id: '0'
        },
      });

    }
  })
};

exports.createDefaultPeriodAvailabilities = createDefaultPeriodAvailabilities;