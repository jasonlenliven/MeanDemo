var mongoose = require('mongoose');

var memberSchema = mongoose.Schema({
  firstName: {type: String, required: '{PATH} is required'},
  lastName: {type: String, required: '{PATH} is required'},
  email: {type: String, required: '{PATH} is required'},
  prefix: {type: String},
  group_id: {type: String, required: '{PATH} is required'}
});

memberSchema.methods = {

}

var Member = mongoose.model("Member", memberSchema);

function createDefaultMembers() {
  Member.find({}).exec(function (err, colection) {
    if (colection.length === 0) {
      Member.create({
        firstName: 'Tyrone',
        lastName: 'Hardy',
        prefix: 'Dr.'
      });

      Member.create({
        firstName: 'James',
        lastName: 'Nowak',
        prefix: 'Dr.'
      });

      Member.create({
        firstName: 'Billy',
        lastName: 'Stern',
        prefix: 'Dr.'
      });

      Member.create({
        firstName: 'Peter',
        lastName: 'Yoo',
        prefix: 'Dr.'
      });

      Member.create({
        firstName: 'Mary',
        lastName: 'Jeswani',
        prefix: 'Dr.'
      });

      Member.create({
        firstName: 'Tom',
        lastName: 'Marcisz',
        prefix: 'Dr.'
      });
    }
  })
};

exports.createDefaultMembers = createDefaultMembers;