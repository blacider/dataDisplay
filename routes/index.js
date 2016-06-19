var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '总览' , page:1});
});


router.get('/system', function(req, res, next) {
  res.render('systems', { title: '系统' , page:2});
});


router.get('/com', function(req, res, next) {
  res.render('com', { title: '系统' , page:3});
});
module.exports = router;
