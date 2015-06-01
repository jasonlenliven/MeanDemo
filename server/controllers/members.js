var mongoose = require('mongoose'),
    Member = mongoose.model('Member');


exports.getMembers = function (req, res) {
  var memberId = req.params.id;
  console.log('Member Id: ' + memberId);
  if (memberId) {
    Member.findById(memberId, function(err, member) {
      if(err) {
        console.log('Cannot find member. Id: ' + memberId);
      }
      res.send(member);
    });
  } else {
    Member.find({}).exec(function (err, collection) {
      res.send(collection);
    });
  }
};
