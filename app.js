var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var mongoose   = require('mongoose');
var passport = require('passport');
var configAuth = require('./config/auth');

var routes = require('./routes/index');
var users = require('./routes/users');
var hosts = require('./routes/hosts');
var posts = require('./routes/posts');
var routeAuth = require('./routes/auth');
var app = express();

app.locals.moment = require('moment');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}


// mongodb connect
mongoose.connect('mongodb://sehee:se921227@ds149577.mlab.com:49577/sehee');
mongoose.connection.on('error', console.log);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(path.join(__dirname, '/bower_components')));

app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

var MongoStore = require('connect-mongo')(session);
app.sessionStore = new MongoStore({mongooseConnection: mongoose.connection});
app.use(session({
  resave: true,
  key: 'express.sid',
  saveUninitialized: true,
  secret: 'long-long-long-secret-string-1313513tefgwdsvbjkvasd',
  store: app.sessionStore
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(path.join(__dirname, '/bower_components')));


app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.currentUser = req.session.user;
  res.locals.flashMessages = req.flash();
  next();
});

configAuth(passport);

app.use('/', routes);
app.use('/users', users);
app.use('/hosts', hosts);
app.use('/posts', posts);

routeAuth(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// var aws = require('aws-sdk');
// var S3_BUCKET = process.env.S3_BUCKET;

// app.get('/s3', function(req, res, next) {
//   var s3 = new aws.S3({region: 'ap-northeast-2'});
//   var filename = req.query.filename;
//   var type = req.query.type;
//   s3.getSignedUrl('putObject', {
//     Bucket: S3_BUCKET,
//     Key: filename,
//     Expires: 900,
//     ContentType: type,
//     ACL: 'public-read'
//   }, function(err, data) {
//     if (err) {
//       console.log(err);
//       return res.json({err: err});
//     }
//     res.json({
//       signedRequest: data,
//       url: `https://${S3_BUCKET}.s3.amazonaws.com/${filename}`
//     });
//   });
// });

// app.get('/new', function(req, res, next) {
//   res.render("new");
// });

// app.post('/', function(req, res, next) {
//   var img = new Img({url: req.body.url});
//   img.save(function(err, doc) {
//     if (err) {
//       return next(err);
//     }
//     res.redirect('/');
//   });
// });

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });




module.exports = app;
