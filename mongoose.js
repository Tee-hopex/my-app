const mongoose = require('mongoose');

const CompletedSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        email: String,
        is_online: Boolean
    },
    { collection: 'completed' }
)

// CompletedSchema.index({
const model = mongoose.model('Completed', CompletedSchema);
module.exports = model;