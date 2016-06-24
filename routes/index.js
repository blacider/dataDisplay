var express = require('express');
var router = express.Router();
var caseDao = require("../modal/dao/caseDao.js");

var dataDao = require("../modal/dao/dataDao.js");
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

router.get('/view', function(req, res, next) {
    var name = req.query.name;
    res.render('viewcom', { title: '公司详情' ,name:name, page:3
    });
});


router.get('/com', function(req, res, next) {
    var current = 1;
    var name = "";
    dataDao.queryAllByConName(name,function(err,results) {
        // results = test;
        console.log(results);
        var start = (current-1)*10;
        var total = Math.ceil(results.length/10);
        var data = results.slice(start, start+10);
        res.render('com', {
            title: '一企一档',
            page: 3,
            total: total,
            current: current,
            data:data
        });
    });
});
router.get('/comtable', function(req, res, next) {
    var current = Number(req.query['p']);
    var name = req.query['name'];
    dataDao.queryAllByConName(name,function(err,results) {
        // results = test;
        console.log(results);
        var start = (current-1)*10;
        var total = Math.ceil(results.length/10);
        var data = results.slice(start, start+10);
        console.log(current, total);
        res.render('comtable', {
            total: total,
            current: current,
            data:data
        });
    });
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

router.get('/table', function(req, res, next) {
    var table = [{'name':'n','age':'11'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'p','age':'13'},
             {'name':'p','age':'13'},
             {'name':'p','age':'13'}],
        tableNames = {name: '姓名',
                      age:'年龄'};
    var current=Number(req.query.p);
    var total = 100;
    res.render('table', {
        title: '总览',
        table: table,
        page:1,
        total :total,
        current:current,
        tableNames:tableNames
    });
});



module.exports = router;
