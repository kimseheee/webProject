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
    if (!form.city) {
        return '도시를 입력해주세요';
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

function needAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
}


router.get('/index', function(req, res, next) {
    Post.find({}, function(err, posts) {
        if (err) {
            return next(err);
        }
        res.render('posts/index', { posts: posts });
    });
});

router.get('/new',needAuth, function(req, res, next) {
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

router.post('/', needAuth, upload.array('photos'), function(req, res, next) {
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
        city: req.body.city,
        address: req.body.address,
        detailAddress: req.body.detailAddress,
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

router.get('/:id/edit', needAuth, function(req, res, next) {
    Post.findById(req.params.id, function(err, post) {  
        if (err) {
            return next(err);
        }
        res.render('posts/edit', {post: post});
    });
});

router.get('/:id/hostingInfo', needAuth, function(req, res, next) {
  Post.find({email: req.session.user.email}, function(err, posts) {
    if (err) {
      return next(err);
    }
    res.render('posts/hostingInfo', {posts: posts});
  });
});


router.put('/:id', needAuth, function(req, res, next) {
    Post.findById({_id: req.params.id}, function(err, post) {
        if (err) {
            return next(err);
        }
        if (post.email !== req.session.user.email) {
            return res.redirect('back'); 
        }
        post.title = req.body.title;
        post.city = req.body.city;
        post.address = req.body.address;
        post.detailAddress = req.body.detailAddress;
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

router.post('/:id/comments', needAuth, function(req, res, next) {
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

router.post('/search', function(req, res, next) {
    Post.find({city: req.body.city}, function(err, posts) {
        if(err) {
            return next(err);
        }
        res.render('posts/search', {posts: posts});
    });
});

router.delete('/:id', needAuth, function(req, res, next) {
    Post.findOneAndRemove({_id: req.params.id}, function(err) { 
        if (err) {
            return next(err);
        }
        res.redirect('/posts/index');
    });
});



module.exports = router;