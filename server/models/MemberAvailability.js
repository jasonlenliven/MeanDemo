var mongoose = require('mongoose');

var memberAvailabilitySchema = mongoose.Schema({
  year: {type: Number, required: '{PATH} is required'},
  month: {type: Number, required: '{PATH} is required'},
  member: {
    id: {type: String, required: '{PATH} is required'},
    firstName: {type: String, required: '{PATH} is required'},
    lastName: {type: String, required: '{PATH} is required'},
    prefix: {type: String}
  },
  preferWorkDays: {type: Array},
  noWorkDays: {type: Array},
  preferOffDays: {type: Array}

});


var MemberAvailability = mongoose.model("MemberAvailability", memberAvailabilitySchema);

function createDefaultMemberAvailabilities() {
  MemberAvailability.find({}).exec(function (err, colection) {
    if (colection.length === 0) {
      MemberAvailability.create({
        year: 2015,
        month: 4,
        member: {
          id: '556b5cf32acd7fa7275b74da',
          firstName: 'Tyrone',
          lastName: 'Hardy',
          prefix: 'Dr.'
        }
      });

    }
  })
};

exports.createDefaultMemberAvailabilities = createDefaultMemberAvailabilities;