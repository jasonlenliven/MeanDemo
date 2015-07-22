var mongoose = require('mongoose'),
    encrypt = require('../utilities/encryption');

var userSchema = mongoose.Schema({
  firstName: {type: String, required: '{PATH} is required'},
  lastName: {type: String, required: '{PATH} is required'},
  username: {
    type: String,
    required: '{PATH} is required',
    unique: true
  },
  salt: {type: String, required: '{PATH} is required'},
  hashed_pwd: {type: String, required: '{PATH} is required'},
  roles: [String]
});

userSchema.methods = {
  authenticate: function(passwordToMatch){
    return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
  }
}

var User = mongoose.model("User", userSchema);

function createDefaultUsers() {
  User.find({}).exec(function (err, colection) {
    if (colection.length === 0) {
      var salt, hash;
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'jason.01!');
      User.create({
        firstName: 'Jason',
        lastName: 'Le',
        username: 'jle',
        salt: salt,
        hashed_pwd: hash,
        roles: ['admin']
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'Scheduler!');
      User.create({firstName: 'One', lastName: 'User', username: 'user_1', salt: salt, hashed_pwd: hash, roles: ['group_manager']});
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'Scheduler!');
      User.create({firstName: 'Two', lastName: 'User', username: 'user_2', salt: salt, hashed_pwd: hash, roles: ['group_manager']});
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'Scheduler!');
      User.create({firstName: 'Three', lastName: 'User', username: 'user_3', salt: salt, hashed_pwd: hash, roles: ['group_manager']});
    }
  })
};

exports.createDefaultUsers = createDefaultUsers;