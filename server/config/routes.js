var auth = require('./auth'),
    users = require('../controllers/users'),
    members = require('../controllers/members'),
    memberAvailability = require('../controllers/member_availabilities'),
    groups = require('../controllers/groups')
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
  app.get('/api/memberAvailability/:memberId/:year?/:month?', memberAvailability.getMemberAvailability);
  app.post('/api/memberAvailability/', memberAvailability.saveMemberAvailability);

  app.get('/api/groups/:id?', groups.getGroups);
  app.post('/api/groups', groups.createGroup);
  app.delete('/api/groups/:id', groups.deleteGroup);

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