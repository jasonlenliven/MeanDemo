var auth = require('./auth'),
    users = require('../controllers/users'),
    members = require('../controllers/members'),
    memberAvailability = require('../controllers/member_availabilities'),
    periodAvailability = require('../controllers/period_availabilities'),
    groups = require('../controllers/groups'),
    groupSchedules = require('../controllers/group_schedules'),
    scheduleGenerator = require('../controllers/generator/schedule_generator'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function(app) {
  app.get('/api/users', auth.requireRole('admin'), users.getUsers);

  app.post('/api/users', users.createUser);

  app.get('/partials/*', function (req, res) {
    res.render('partials/' + req.params[0]);
  });

  //app.get('/api/member/:id?', members.getMember);
  app.get('/api/members/:id?', members.getMembers);
  app.get('/api/members/group/:groupId', members.getMembersByGroup);
  app.post('/api/members', members.createMember);
  app.delete('/api/members/:id', members.deleteMember);
  app.put('/api/members/:id', members.updateMember);

  app.get('/api/memberAvailability/:memberId/:year?/:month?', memberAvailability.getMemberAvailability);
  app.post('/api/memberAvailability/', memberAvailability.saveMemberAvailability);

  app.get('/api/periodAvailability/:periodId/:memberId?', periodAvailability.getPeriodAvailability);
  app.post('/api/periodAvailability/', periodAvailability.savePeriodAvailability);

  app.get('/api/groupAvailability/:groupId/:year/:month', memberAvailability.getByGroup);

  app.get('/api/groups/:id?', groups.getGroups);
  app.post('/api/groups', groups.createGroup);
  app.delete('/api/groups/:id', groups.deleteGroup);
  app.put('/api/groups/:id', groups.updateGroup);

  app.get('/api/groups/groupSchedules/:groupId', groupSchedules.getSchedules);
  app.post('/api/groupSchedules', groupSchedules.createSchedulePeriod);
  app.get('/api/groupSchedules/:id', groupSchedules.getSchedule);
  app.delete('/api/groupSchedules/:id', groupSchedules.deleteSchedulePeriod);

  app.get('/api/schedules/generate/:periodId', scheduleGenerator.generatePeriodSchedule);

  app.post('/login', auth.authenticate);
  app.post('/logout', function(req, res) {
    req.logout();
    res.end();
  });



  app.get('*', function (req, res) {
    res.render('index', {
      //mongoMessage: mongoMessage
      bootstrappedUser: req.user
    });
  });
}