const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone_no: String,
    address: String,
    img_url: String,
    img_id: String,
    posts: [String],
    post_count: {type: Number, default: 0},
    followers: [String],
    timestamp: Number,
    is_online: {type: Boolean, defautl: true},
    is_deleted: {type: Boolean, default: false}
}, {collection: 'users'});

const model = mongoose.model('User', userSchema);
module.exports = model;