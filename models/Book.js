var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

 var book = new Schema({
     email: {type: String},
     hostemail: {type: String},
     title: {type: String},
     country: {type: String},
     address: {type: String},
     price: {type: String},
     checkin: {type: Date},
     checkout: {type: Date},
     people: {type: Number},
     booked: {type: String, default: "false"},
     cancelRequest: {type: String, default: "false"},
     cancelRejected: {type: String, default: "false"}
});

var Book = mongoose.model('Book', book);
module.exports = Book;