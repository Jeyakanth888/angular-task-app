/*const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/ng_app_db';

MongoClient.connect(url, ({ useNewUrlParser: true }), function(err, db) {
  if (err) throw err;
  console.log("Database connected");
});
*/

const mongoose = require('mongoose');
const userModel = require('../models/user');
const userImageModel = require('../models/userPhoto');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ng_app_db', ({ useNewUrlParser: true }))
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

exports.users = userModel;
exports.usersprofileimages = userImageModel;