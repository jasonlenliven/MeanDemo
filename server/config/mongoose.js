var mongoose = require('mongoose'),
    userModel = require('../models/User'),
    groupModel = require('../models/Group'),
    memberModel = require('../models/Member'),
    memberAvailability = require('../models/MemberAvailability');

module.exports = function (config) {
  mongoose.connect(config.db);

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error ...'));
  db.once('open', function callback() {
    console.log('MeanDemo DB opened');
  });

  userModel.createDefaultUsers();
  //groupModel.createDefaultGroups();
  //memberModel.createDefaultMembers();
  //memberAvailability.createDefaultMemberAvailabilities();

}

