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

exports.getMembersByGroup = function (req, res) {
  var groupId = req.params.groupId;
  var max = req.query.max ? req.query.max : 0;
  var skip = req.query.skip ? req.query.skip : 0;
  console.log('Get members by Group Id: ' + groupId + " max: " + max + " skip: " + skip);
  if (groupId) {
    Member.find({group_id:groupId}).skip(skip).limit(max).exec(function (err, collection) {
      if(err) {
        console.log('Cannot find member. Group Id: ' + groupId);
        res.send({reason:err.toString()});
      }
      res.send(collection);
    });
  }
};

exports.createMember = function (req, res) {
  var data = req.body;
  Member.create(data, function (err, member) {
    if (err) {
      res.status(400);
      return res.send({reason:err.toString()});
    }
    res.send(member);
  })
};

exports.updateMember = function (req, res) {
  var memberData = req.body;
  console.log("updating member. id: " + req.params.id);
  Member.update({_id:req.params.id}, memberData, function (err, member) {
    if (err) {
      console.log(err.toString());
      return res.send({reason:err.toString()});
    }
    res.send(member);
  })
};

exports.deleteMember = function (req, res) {
  var memberId = req.params.id;
  console.log('Deleting member with id: ' + memberId);
  Member.findById(memberId, function (err, member) {
    if (err) {
      console.log('Cannot find member. Id: ' + memberId);
      res.status(404);
      return res.send({reason: err.toString()});
    } else {
      member.remove(function (err) {
        if (err) {
          res.status(400);
          return res.send({reason: err.toString()});
        }

        return res.send(200);
      });
    }
  });
};
