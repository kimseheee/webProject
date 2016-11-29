var express = require('express');
var router = express.Router();


router.get('/index', function(req, res, next) {
  res.render('hosts/index');
});

module.exports = router;