const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    username: String,
    user_id: String, // _id of the user document that made the comment
    body: String, // the actual comment
    post_id: String, // _id of the post document the comment was made on
    timestamp: Number
}, {collection: 'comments'});

const model = mongoose.model('Comment', commentSchema);
module.exports = model;