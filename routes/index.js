var express = require('express');
var router = express.Router();
var caseDao = require("../modal/dao/caseDao.js");
var crypto = require('crypto');
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
var request = require('request');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', {
        title: '总览',
        page:1
    });
});


router.get('/system', function(req, res, next) {
    res.render('systems', { 
        title: '系统' ,
        page:2,
        table:[{'name':'n','age':'11'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'p','age':'13'},
             {'name':'p','age':'13'},
             {'name':'p','age':'13'}],
        tableNames:{name: '姓名',
                      age:'年龄'}});
});

router.get('/data', function(req, res, next) {
    res.render('data', { title: '大数据共享'});
});

router.get('/view', function(req, res, next) {
    var name = req.query.name;
    res.render('viewcom', { title: '公司详情' ,name:name, page:3
    });
});
router.get('/coms', function(req, res, next) {
    res.render('coms', {
        title: '一企一档'
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

router.get('/other', function(req, res, next) {
    var n = Number(req.query.n);
    // 1:环保  2：审批系统
    if (n === 1) {
        request('http://172.16.55.74:8442/lgydzf/login_sso.jsp?user='+req.session.name, function(error, resp, body) {
            var token = crypto.createHash('md5').update(req.session.name+body.trim()).digest('hex');
            res.redirect('//172.16.55.74:8442/lgydzf/login_sso.jsp?token=' + token);
        });
    } else if (n == 2) {
        request('http://172.23.8.24/SingleLoginService/getRandom?user=zgh', function(error, resp, body) {
            var token = crypto.createHash('md5').update('zgh'+body.trim()).digest('hex');
            res.redirect('//172.23.8.24/SingleLoginService/redirection?token=' + token);
        });
    }
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
