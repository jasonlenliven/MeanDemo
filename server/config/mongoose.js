var mongoose = require('mongoose'),
    crypto = require('crypto');

module.exports = function (config) {
  mongoose.connect(config.db);

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error ...'));
  db.once('open', function callback() {
    console.log('MeanDemo DB opened');
  });

  var userSchema = mongoose.Schema({
    firstName: String,
    username: String,
    lastName: String,
    salt: String,
    hashed_pwd: String
  });

  userSchema.methods = {
    authenticate: function(passwordToMatch){
      return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
    }
  }

  var User = mongoose.model("User", userSchema);

  User.find({}).exec (function(err,colection) {
    if(colection.length === 0) {

      var salt, hash;
      salt = createSalt();
      hash = hashPwd(salt, 'jason');
      User.create({firstName:'Jason', lastName:'Le', username:'jle', salt: salt, hashed_pwd: hash});
      salt = createSalt();
      hash = hashPwd(salt, 'tim');
      User.create({firstName:'Tim', lastName:'Cookie', username:'tcookie', salt: salt, hashed_pwd: hash});
      salt = createSalt();
      hash = hashPwd(salt, 'super');
      User.create({firstName:'Super', lastName:'Man', username:'sman', salt: salt, hashed_pwd: hash});
    }
  });

}

function createSalt() {
  return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt, pwd) {
  // create hash password authentication code
  var hmac = crypto.createHmac('sha1', salt);
  // return hex based representation of the hash pwd
  return hmac.update(pwd).digest('hex');
}