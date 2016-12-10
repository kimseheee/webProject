var express = require('express'),
    multer  = require('multer'),
    path = require('path'),
    _ = require('lodash'),
    fs = require('fs'),
    upload = multer({ dest: 'tmp' });
var Post = require('../models/Post');
var Comments = require('../models/Comment');
var router = express.Router();
var mimetypes = {
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/png": "png"
};

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
        Comments.find({post: post.id}, function(err, comments) {
            if (err) {
                return next(err);
            }
            post.read++;
            post.save();
            res.render('posts/show', {post: post, comments: comments}); 
        });
    });
});

router.post('/', upload.array('photos'), function(req, res, next) {
    var dest = path.join(__dirname, '../public/images/');
    var images = [];
    if (req.files && req.files.length > 0) {
        _.each(req.files, function(file) {
        var ext = mimetypes[file.mimetype];
        if (!ext) {
            return;
        }
        var filename = file.filename + "." + ext;
        fs.renameSync(file.path, dest + filename);
        images.push("/images/" + filename);
    });
  }

  var postCon = new Post({
            email: req.session.user.email,
            images: images,
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

router.post('/:id/comments', function(req, res, next) {
    var comment = new Comments({
        post: req.params.id,
        email: req.body.email,
        content: req.body.content
    });

    comment.save(function(err) {
        if (err) {
        return next(err);
        }
        Post.findByIdAndUpdate(req.params.id, {$inc: {numComment: 1}}, function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/posts/' + req.params.id);
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