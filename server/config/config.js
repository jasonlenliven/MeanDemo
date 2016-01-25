var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
module.exports = {
  development: {
    rootPath: rootPath,
    //db: 'mongodb://localhost:27017/scheduler',
    db: 'mongodb://super:superTrooper@ds031852.mongolab.com:31852/meandemo',
    port: process.env.PORT || 3030
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://jle:jason.01!@ds029787.mongolab.com:29787/scheduler',
    port: process.env.PORT || 80
  }
}