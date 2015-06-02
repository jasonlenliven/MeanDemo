var mongoose = require('mongoose'),
    Member = mongoose.model('Member'),
    MemberAvailability = mongoose.model('MemberAvailability');


exports.getMemberAvailability = function (req, res) {
  var year = req.params.year;
  var month = req.params.month;
  var memberId = req.params.memberId;
  MemberAvailability.findOne({year:year, month:month, 'member.id':memberId}, function(err, memberAvailability) {
    if(err) {
      console.log('Cannot find member. Id: ' + memberId);
    }
    if (!memberAvailability){
      Member.findById(memberId, function (err, member) {
        if (member) {
          MemberAvailability.create({
            year: year,
            month: month,
            member: {
              id: member._id,
              firstName: member.firstName,
              lastName: member.lastName,
              prefix: member.prefix
            }
          }, function (err, newMemberAvailability) {
            if (err) {
              //return res.send({reason:err.toString()});
              console.log("Failed to create new member availability. " + err.toString());
            }
            res.send(newMemberAvailability);
          });
        }
      });

    } else {
      res.send(memberAvailability);
    }
  });
};

exports.saveMemberAvailability = function (req, res, next) {
  var userData = req.body;
  console.log('Saving ' + userData._id);

  MemberAvailability.update({_id:userData._id}, userData, function (err, memberAvailability) {
    if (err) {
      console.log(err.toString());
      return res.send({reason:err.toString()});
    }
    res.send(memberAvailability);
  })
};
