var mongoose = require('mongoose');
var taskDocumentSchema = new mongoose.Schema({
    ref_id: String,
    t_id: String,
    created_at: Date,
    doc_path: String,
    doc_type:String,
    doc_size:Number,
    doc_active:Boolean
});
module.exports = mongoose.model('tasks_documentation', taskDocumentSchema);