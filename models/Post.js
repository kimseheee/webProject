var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var board = new Schema({
    email: {type: String, required: true},
    title: {type: String},
    country: {type: String},
    address: {type: String},
    price: {type: String},
    facility: {type: String},
    rule: {type: String},
    content: {type: String},
    read: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now}
});

var Post = mongoose.model('Post', board);
module.exports = Post;