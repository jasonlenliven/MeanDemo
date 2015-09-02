var mongoose = require('mongoose'),
    GroupSchedule = mongoose.model('GroupSchedule');


exports.getSchedules = function (req, res) {
  var groupId = req.params.groupId;
  console.log('getting schedule period for group : Group Id: ' +  groupId);
  if (groupId) {
    GroupSchedule.find({group_id:groupId}).exec(function (err, collection) {
      if(err) {
        console.log('Cannot find schedules for group with id: ' + groupId);
        res.send({reason:err.toString()});
      }
      res.send(collection);
    });
  }
};

exports.createSchedulePeriod = function (req, res, next) {
  var data = req.body;
  GroupSchedule.create(data, function (err, schedulePeriod) {
    if (err) {
      res.status(400);
      return res.send({reason:err.toString()});
    }
    res.send(schedulePeriod);
  })
};

exports.deleteSchedulePeriod = function (req, res) {
  var id = req.params.id;
  console.log('Deleting period with id: ' + id);
  GroupSchedule.findById(id, function(err, period) {
    if(err) {
      console.log('Cannot find period. Id: ' + id);
      res.status(404);
      return res.send({reason:err.toString()});
    } else {
      period.remove(function(err) {
        if (err) {
          res.status(400);
          return res.send({reason:err.toString()});
        }

        return res.send(200);
      });
    }
  });
};

exports.getSchedule = function (req, res) {
  var periodId = req.params.id;
  console.log('Period Id: ' + periodId);
  if (periodId) {
    GroupSchedule.findById(periodId, function(err, period) {
      if(err) {
        console.log('Cannot find period. Id: ' + periodId);
      }
      res.send(period);
    });
  }
};