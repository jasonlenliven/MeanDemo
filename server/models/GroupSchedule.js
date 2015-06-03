var mongoose = require('mongoose');

var groupScheduleSchema = mongoose.Schema({
  year: {type: Number, required: '{PATH} is required'},
  month: {type: Number, required: '{PATH} is required'},
  group_id: {type: String, required: '{PATH} is required'},
  group_name: {type: String},
  schedule: {type: Array}
});


var GroupSchedule = mongoose.model("GroupSchedule", groupScheduleSchema);
