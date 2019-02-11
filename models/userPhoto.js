var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  imagetype: String,
  imagepath: String,
  imagesize:Number,
  ref_id:String,
  imageactive:Boolean
});
module.exports = mongoose.model('usersprofileimages', userSchema);
