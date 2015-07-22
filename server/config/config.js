var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
module.exports = {
  development: {
    rootPath: rootPath,
    db: 'mongodb://localhost:27017/scheduler',
    port: process.env.PORT || 3030
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://jle:meandemo@ds031852.mongolab.com:31852/scheduler',
    port: process.env.PORT || 80
  }
}