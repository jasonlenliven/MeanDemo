var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
  name: {type: String},
  description: {type: String}
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