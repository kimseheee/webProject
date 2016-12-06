var express = require('express');
var router = express.Router();
var Book = require('../models/Book');
var Post = require('../models/Post')

router.get('/index', function(req, res, next) {
  res.render('hosts/index');
});

router.get('/reservationInfo', function(req, res, next) {
    Book.find({}, function(err, books) {
        if (err) {
            return next(err);
        }
        res.render('hosts/reservationInfo', { books: books });
    });
});

router.get('/confirm', function(req, res, next) {
    Book.find({hostemail: req.session.user.email}, function(err, books) {
        if (err) {
            return next(err);
        }
        res.render('hosts/confirm', { books: books });
    });
})

router.post('/:id/book', function(req, res, next) {
    Post.findById(req.params.id, function(err, post) {     
        var book = new Book({
            email: req.session.user.email,
            hostemail: post.email,
            title: post.title,
            country: post.country,
            address: post.address,
            price: post.price,
            checkin: req.body.checkin,
            checkout: req.body.checkout,
            people: req.body.people
        });
        book.save(function(err) {
            if (err) {
                return next(err);
            }
            res.redirect('/posts/index');
        });
    });
});

router.get('/:id', function(req, res, next) {
    Book.findById(req.params.id, function(err, book) {     
        if(err) {
            return next(err);
        }
        res.render('posts/show', {book: book}); 
    });
});

router.get('/:id/reservationInfo', function(req, res, next) {
    Book.find({email: req.session.user.email}, function(err, books) {
    if (err) {
      return next(err);
    }
    res.render('hosts/reservationInfo', {books: books});
  });
});

router.delete('/:id', function(req, res, next) {
    Book.findOneAndRemove({_id: req.params.id}, function(err) { 
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;