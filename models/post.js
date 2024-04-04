const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    username: String,
    user_id: String,
    user_img_url: String,
    post_url: String,
    post_id: String,
    post_text: String,
    comment_count: {type: Number, default: 0},
    comments: [String],
    like_count: {type: Number, default: 0},
    likes: [String],
    timestamp: Number
}, {collection: 'posts'});

const model = mongoose.model('Post', postSchema);
module.exports = model;