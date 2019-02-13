var mongoose = require('mongoose');
var topicSchema = new mongoose.Schema({
    topic_name: String,
    topic_description: String,
    created_at:Date,
});
module.exports = mongoose.model('assignment_topics', topicSchema);