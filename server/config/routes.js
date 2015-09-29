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

  app.post('/api/users', auth.requireRole('group_manager'), users.createUser);

  app.get('/partials/*', function (req, res) {
    res.render('partials/' + req.params[0]);
  });

  //app.get('/api/member/:id?', members.getMember);
  app.get('/api/members/:id?', auth.requireRole('group_manager'), members.getMembers);
  app.get('/api/members/group/:groupId', auth.requireRole('group_manager'), members.getMembersByGroup);
  app.post('/api/members', auth.requireRole('group_manager'), members.createMember);
  app.delete('/api/members/:id', auth.requireRole('group_manager'), members.deleteMember);
  app.put('/api/members/:id', auth.requireRole('group_manager'), members.updateMember);

  app.get('/api/memberAvailability/:memberId/:year?/:month?', auth.requireRole('group_manager'), memberAvailability.getMemberAvailability);
  app.post('/api/memberAvailability/', auth.requireRole('group_manager'), memberAvailability.saveMemberAvailability);

  app.get('/api/periodAvailability/:periodId/:memberId?', auth.requireRole('group_manager'), periodAvailability.getPeriodAvailability);
  app.post('/api/periodAvailability/', auth.requireRole('group_manager'), periodAvailability.savePeriodAvailability);

  app.get('/api/groupAvailability/:groupId/:year/:month', auth.requireRole('group_manager'), memberAvailability.getByGroup);

  app.get('/api/groups/:id?', auth.requireRole('group_manager'), groups.getGroups);
  app.post('/api/groups', auth.requireRole('group_manager'), groups.createGroup);
  app.delete('/api/groups/:id', auth.requireRole('group_manager'), groups.deleteGroup);
  app.put('/api/groups/:id', auth.requireRole('group_manager'), groups.updateGroup);

  app.get('/api/groups/groupSchedules/:groupId', auth.requireRole('group_manager'), groupSchedules.getSchedules);
  app.post('/api/groupSchedules', auth.requireRole('group_manager'), groupSchedules.createSchedulePeriod);
  app.get('/api/groupSchedules/:id', auth.requireRole('group_manager'), groupSchedules.getSchedule);
  app.delete('/api/groupSchedules/:id', auth.requireRole('group_manager'), groupSchedules.deleteSchedulePeriod);

  app.get('/api/schedules/generate/:periodId', auth.requireRole('group_manager'), scheduleGenerator.generatePeriodSchedule);

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