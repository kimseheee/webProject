var express = require('express');
var router = express.Router();
var Post = require('../models/Post');

function validate(form) {
    if (!form.title) {
        return '제목을 입력해주세요';
    }
    if (!form.country) {
        return '나라를 입력해주세요';
    }
    if (!form.address) {
        return '주소를 입력해주세요';
    }
    if (!form.price) {
        return '가격을 입력해주세요';
    }
    if (!form.facility) {
        return '편의시설을 입력해주세요';
    }
    if (!form.rule) {
        return '이용규칙을 입력해주세요';
    }
    if (!form.content) {
        return '내용을 입력해주세요';
    }
    return null;
}

router.get('/index', function(req, res, next) {
    Post.find({}, function(err, posts) {
        if (err) {
            return next(err);
        }
        res.render('posts/index', { posts: posts });
    });
});

router.get('/new', function(req, res, next) {
    res.render('posts/edit', {post: {}});
});

router.get('/:id', function(req, res, next) {
    Post.findById(req.params.id, function(err, post) {     
        if(err) {
            return next(err);
        }
        post.read++;
        post.save();
        res.render('posts/show', {post: post}); 
    });
});

router.post('/', function(req, res, next) {
    var error = validate(req.body);
    if (error) {
        return res.redirect('back');
    }
    var postCon = new Post({
            email: req.session.user.email,
            title: req.body.title,
            country: req.body.country,
            address: req.body.address,
            price : req.body.price,
            facility: req.body.facility,
            rule: req.body.rule,
            content: req.body.content
    });
    postCon.save(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/posts/index');
    });
});

router.get('/:id/edit', function(req, res, next) {
    Post.findById(req.params.id, function(err, post) {  
        if (err) {
            return next(err);
        }
        res.render('posts/edit', {post: post});
    });
});

router.get('/:id/hostingInfo', function(req, res, next) {
  Post.find({email: req.session.user.email}, function(err, posts) {
    if (err) {
      return next(err);
    }
    res.render('posts/hostingInfo', {posts: posts});
  });
});


router.put('/:id', function(req, res, next) {
    Post.findById({_id: req.params.id}, function(err, post) {
        if (err) {
            return next(err);
        }
        if (post.email !== req.session.user.email) {
            return res.redirect('back'); 
        }
        post.title = req.body.title;
        post.country = req.body.country;
        post.address = req.body.address;
        post.price = req.body.price;
        post.facility = req.body.facility;
        post.rule = req.body.rule;
        post.content = req.body.content;
        post.save(function(err) {
            if (err) {
                return next(err);
            }
            res.redirect('/posts/index');
        });
    });
});

router.delete('/:id', function(req, res, next) {
    Post.findOneAndRemove({_id: req.params.id}, function(err) { 
        if (err) {
            return next(err);
        }
        res.redirect('/posts/index');
    });
});



module.exports = router;