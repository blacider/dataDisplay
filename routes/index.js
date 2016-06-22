var express = require('express');
var router = express.Router();
var caseDao = require("../modal/dao/caseDao.js");


// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: '总览',
        page:1
    });
});


router.get('/system', function(req, res, next) {
    caseDao.queryAll(function(err, results) {
        res.render('systems', { title: '系统' , page:2, tableData:results});
    });
});


router.get('/com', function(req, res, next) {
  res.render('com', { title: '系统' , page:3});
});

router.get('/case', function(req, res, next) {
    var re_ = [1];
    caseDao.queryAll(function(err, results) {
        if (!err) {
            console.log(err);
            res.json(results);
        }
    });
});



module.exports = router;
