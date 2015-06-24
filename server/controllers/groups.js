var mongoose = require('mongoose'),
    Group = mongoose.model('Group');


exports.getGroups = function (req, res) {
  var groupId = req.params.id;
  console.log('Group Id: ' +  groupId);
  if (groupId) {
    Member.findById(groupId, function(err, group) {
      if(err) {
        console.log('Cannot find group. Id: ' + groupId);
      }
      res.send(group);
    });
  } else {
    Group.find({}).exec(function (err, collection) {
      res.send(collection);
    });
  }
};

exports.createGroup = function (req, res, next) {
  var groupData = req.body;
  Group.create(groupData, function (err, group) {
    if (err) {
      res.status(400);
      return res.send({reason:err.toString()});
    }
    res.send(group);
  })
};

exports.deleteGroup = function (req, res) {
  var groupId = req.params.id;
  console.log('Deleting group with id: ' + req.body.id);
  Group.findById(groupId, function(err, group) {
    if(err) {
      console.log('Cannot find group. Id: ' + groupId);
      res.status(404);
      return res.send({reason:err.toString()});
    } else {
      group.remove(function(err) {
        if (err) {
          res.status(400);
          return res.send({reason:err.toString()});
        }

        return res.send(200);
      });
    }
  });
};
