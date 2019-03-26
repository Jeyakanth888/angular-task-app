
const mongoose = require('mongoose');
const userModel = require('../models/user');
const userImageModel = require('../models/userPhoto');
const newTopicModel = require('../models/newTopic');
const taskModel = require('../models/assignTask');
const taskDocumentModel = require('../models/submitTaskDocument');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ng_app_db', ({ useNewUrlParser: true }))
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));

exports.users = userModel;
exports.usersprofileimages = userImageModel;
exports.assignment_topics = newTopicModel;
exports.assigned_tasks = taskModel ;
exports.tasks_documentations =  taskDocumentModel;
