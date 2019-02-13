var mongoose = require('mongoose');
var taskSchema = new mongoose.Schema({
    ref_id: String,
    t_id: String,
    created_at:Date,
    task_date:Date,
});
module.exports = mongoose.model('assigned_tasks', taskSchema);