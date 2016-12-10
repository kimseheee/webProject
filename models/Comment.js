var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var comment = new Schema({
  post: {type: Schema.Types.ObjectId, required: true, trim: true},
  email: {type: String, required: true, trim: true},
  content: {type: String, required: true, trim: true},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

var Comments = mongoose.model('ImgComment', comment);

module.exports = Comments;
