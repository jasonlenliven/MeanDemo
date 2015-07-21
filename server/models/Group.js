var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
  name: {type: String, required: '{PATH} is required'},
  description: {type: String},
  manager_first_name: {type: String, required: '{PATH} is required'},
  manager_last_name: {type: String, required: '{PATH} is required'},
  manager_phone: {type: String, required: '{PATH} is required'},
  manager_email: {type: String, required: '{PATH} is required'}
});

groupSchema.methods = {

}

var Group = mongoose.model("Group", groupSchema);

function createDefaultGroups() {
  Group.find({}).exec(function (err, colection) {
    if (colection.length === 0) {
      Group.create({
        name: 'SampleGroup'
      });

    }
  })
};

exports.createDefaultGroups = createDefaultGroups;