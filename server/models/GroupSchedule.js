var mongoose = require('mongoose');

var groupScheduleSchema = mongoose.Schema({
  startDate: {type: Date, required: '{PATH} is required'},
  endDate: {type: Date, required: '{PATH} is required'},
  group_id: {type: String, required: '{PATH} is required'},
  group_name: {type: String},
  schedule: {type: Array}
});


var GroupSchedule = mongoose.model("GroupSchedule", groupScheduleSchema);

function createDefaultGroupSchedule(groupId) {
  GroupSchedule.find({}).exec(function (err, colection) {
    if (colection.length === 0) {
      var today = new Date();
      GroupSchedule.create({
        startDate: today,
        endDate: today.setDate(today.getDate() + 30),
        group_id: groupId

      });

    }
  })
};

exports.createDefaultGroupSchedule = createDefaultGroupSchedule;