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
        title: '广州开发区审批监管大数据平台',
        page:1
    });
});

var names = {
    sf:{
        FN:"档案号",
        NAME:"客户名称",
        MONTH:"抄表月份",
        SHORT:"简称",
        CONSUMPTION:"本月用水量",
        INDUSTRY:"行业"
    },
    df:{
        ID:"id",
        NAME:"客户名称",
        MONTH:"抄表月份",
        TYPE:"类型",
        CONSUMPTION:"本月用点量"
    },
    gs:{
        ZCH:"企业代码",
        MC:"企业名",
        FDDBR:"法人",
        ZYXMLB:"行业",
        DZ:"地址",
        CLRQ:"注册时间"
    },
    jg:{
        CASE_MEMBER:"违法公司",
        MAIN_PERSON:"执法人",
        CREATE_DATE:"日期",
        CASE_NAME:"案件名",
        CASE_SITUATION:"案件描述",
        UNIT_PUNISH_MONEY:"罚款金额",
        LEGAL_NAME:"责任人"
    },
    sp:{
        approve_item:"事项名称",
        cust_name :"企业名称",
        start_date:"申请日期",
        complete_date:"批准时间",
        '批准':'审批结果'
    }
};
router.get('/system', function(req, res, next) {
    var n = "sf";
    if (req.query.n) n = req.query.n;
    if (n == 'jg') {
        res.render('jianguan', {
            title: '广州开发区审批监管大数据平台' ,
            name:n
        });
        return;
    }
    res.render('systems', {
        title: '广州开发区审批监管大数据平台' ,
        table:[],
        tableNames:names[n],
        name:n
    });
});

router.get('/getData', function(req, res, next) {
    res.json({
        table:[{'name':'n','age':'11'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'r','age':'12'},
             {'name':'p','age':'13'},
             {'name':'p','age':'13'},
             {'name':'p','age':'13'}]});
});

router.get('/data', function(req, res, next) {
    res.render('data', { title: '广州开发区审批监管大数据平台'});
});

router.get('/view', function(req, res, next) {
    var name = req.query.name;
    res.render('viewcom', { title: '广州开发区审批监管大数据平台' ,name:name, page:3
    });
});
router.get('/coms', function(req, res, next) {
    res.render('coms', {
        title: '广州开发区审批监管大数据平台',
        table:[],
        tableNames : {
            ZCH: '统一社会信用代码<br>（组织结构代码）',
            MC: '企业名称',
            DZ: '地址',
            ZTZT: '经营状态',
            SUPERVISE_RANK: '监管等级'
        }
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
    // 1:环保  2：审批系统  3:安监 4:劳动局 5 权责
    if (n === 1) {
        request('http://172.16.55.74:8442/lgydzf/login_byuser_sso.jsp?user='+req.session.name, function(error, resp, body) {
            if (error) {
                res.send("该系统内部系统错误<br>错误信息:"+JSON.stringify(error));
                return error;
            }
            var token = crypto.createHash('md5').update(req.session.name+body.trim()).digest('hex');
            res.redirect('http://172.16.55.74:8442/lgydzf/login_byuser_sso.jsp?token=' + token);
        });
    } else if (n == 2) {
        request('http://172.23.8.24/SingleLoginService/getRandom?user=qiujx', function(error, resp, body) {
            if (error) {
                res.send("该系统内部系统错误<br>错误信息:"+JSON.stringify(error));
                return error;
            }
            var token = crypto.createHash('md5').update('qiujx'+body.trim()).digest('hex');
            res.redirect('//172.23.8.24/SingleLoginService/redirection?token=' + token);
        });
    } else if (n == 3) {
        request('http://kfqajj.gdd.gov.cn/khsafety/signature!getToken.action?account=ajtest', function(error, resp, body) {
            if (error) {
                res.send("该系统内部系统错误<br>错误信息:"+JSON.stringify(error));
                return error;
            }
            var token = crypto.createHash('md5').update('ajtest'+body.trim()).digest('hex');
            res.redirect('http://kfqajj.gdd.gov.cn/khsafety/signature!loginByToken.action?token=' + token);
        });
    } else if (n == 4) {
        request('http://172.23.8.25:8089/ldzf_lg/ldzf-dddl!login.action?user=hum', function(error, resp, body) {
            if (error) {
                res.send("该系统内部系统错误<br>错误信息:"+JSON.stringify(error));
                return error;
            }
            var t=JSON.parse(body)["result"];
            t = JSON.parse(t)["code"];
            res.redirect('http://172.23.8.25:8089/ldzf_lg/ldzf-dddl!checkValid.action?token='+t);
        });
    } else if (n === 5) {
        request('http://172.23.2.33/admin/ssoServlet?user=admin', function(error, resp, body) {
            if (error) {
                res.send("该系统内部系统错误<br>错误信息:"+JSON.stringify(error));
                return error;
            }
            var token = crypto.createHash('md5').update('admin'+body.trim()).digest('hex');
            res.redirect('http://172.23.2.33/admin/ssoServlet?token=' + token);
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
        title: '广州开发区审批监管大数据平台',
        table: table,
        page:1,
        total :total,
        current:current,
        tableNames:tableNames
    });
});



module.exports = router;
