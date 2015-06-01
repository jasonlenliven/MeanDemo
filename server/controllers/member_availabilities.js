var mongoose = require('mongoose'),
    MemberAvailability = mongoose.model('MemberAvailability');


exports.getMemberAvailability = function (req, res) {
  var year = req.params.year;
  var month = req.params.month;
  var memberId = req.params.memberId;
  console.log('Year: ' + year);
  console.log('Month: ' + month);
  console.log('Member Id: ' + memberId);
  MemberAvailability.findOne({year:year, month:month, 'member.id':memberId}, function(err, member) {
    if(err) {
      console.log('Cannot find member. Id: ' + memberId);
    }
    res.send(member);
  });
};

exports.saveMemberAvailability = function (req, res, next) {
  var userData = req.body;
  console.log('Saving ' + userData.preferWorkDays);

  MemberAvailability.update(userData, function (err, memberAvailability) {
    if (err) {

      return res.send({reason:err.toString()});
    }
    res.send(memberAvailability);
  })
};
