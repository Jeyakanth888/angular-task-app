var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  mobilenumber: String,
  dob: String,
  email: String,
  gender: String,
  maritalstatus: String,
  userRole: Number,
  userLog: Number,
  userActive: Boolean,
  password: String,
  last_login: String,
  created_at:Date,
  address:Object,
  profileimage:String
});
module.exports = mongoose.model('users', userSchema);
