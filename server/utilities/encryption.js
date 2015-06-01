var crypto = require('crypto');

exports.createSalt = function () {
  return crypto.randomBytes(128).toString('base64');
}

exports.hashPwd = function (salt, pwd) {
  // create hash password authentication code
  var hmac = crypto.createHmac('sha1', salt);
  // return hex based representation of the hash pwd
  return hmac.update(pwd).digest('hex');
}