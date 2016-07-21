var express = require('express');
var router = express.Router();
var mysqlDao = require("../modal/dao/mysqlDao.js");


function getTable(tableUrl, current, total, tableName, res, req, tableNames) {
    mysqlDao.queryNum(tableName, function(err,result) {
        total = Math.ceil(result[0]['count(*)']/10);
        //console.log("log:::::::",result, ":", total);
        mysqlDao.queryAll(tableName, current, function(err, results) {
            if (!err) {

                //console.log("log:::::::",results);
                var isJg = req.session['isJg'] | false;
                req.session['isJg'] = false;
                res.render('table', {
                    title: '总览',
                    table: results,
                    tableNames:tableNames,
                    current:current,
                    total:+total,
                    tableUrl:tableUrl,
                    isJg:isJg
                });
            }
        });
    });
}

router.get('/jg', function(req, res, next) {
    req.session.isJg = true;
    return res.redirect("/aqjg?p=1");
});


router.get('/ldjg', function(req, res, next) {
    req.session.isJg = true;
    var current=Number(req.query.p);
    var total = 100;
    getTable('/ldjg', current, total, 'LDZF_CASE', res, req, {
        ORG_CODE:"所属中队",
        CASE_TYPE:"基本情况-案件类型（案由）",
        CASE_AMT:"基本情况-涉案金额",
        UNIT_QY_NAME:"单位-单位名称或个人名称",
        JT_LINK:"举报/投诉-联系电话",
        JT_REQUEST:"举报/投诉-要求摘要"
    });
});

router.get('/aqjg', function(req, res, next) {
    req.session.isJg = true;
    var current=Number(req.query.p);
    var total = 100;
    getTable('/aqjg', current, total, 'LGSAFE_CASE', res, req, {
        CREATOR:"创建者",
        MAIN_PERSON:"主要人物",
        CASE_NAME:"案件名",
        CASE_MEMBER:"企业名称",
        MEMBER_TEL:"成员电话",
        CASE_SITUATION:"案件状况",
        LEGAL_NAME:"法人名字"
    });
});

router.get('/hbjg', function(req, res, next) {
    req.session.isJg = true;
    var current=Number(req.query.p);
    var total = 100;
    getTable('/hbjq', current, total, 'T_YYYD_LA_MAIN', res, req, {
        UNDERTAKEMAN:"承办人",
        STARTTIME:"立案时间",
        PARTY:"当事人",
        UNDERTAKEDEPART:"承办部门",
        CASEINTRODU:"案件介绍",
        PUNISHADVICE:"处罚建议"
    });
});

router.get('/syjg', function(req, res, next) {
    req.session.isJg = true;
    var current=Number(req.query.p);
    var total = 100;
    getTable('/syjq', current, total, 'B_CY_RC_J_XCJC', res, req, {
        JCQYMC:"公司名称",
        JCDD:"公司地址",
        DH:"电话"
    });
});

router.get('/df', function(req, res, next) {
    var current=Number(req.query.p);
    var total = 100;
    getTable('/df', current, total, 'T_ELECTRICITY', res, req, {
        MONTH:"抄表月份",
        UNIT:"单位",
        CODE:"工代号",
        NAME:"户名",
        ADDRESS:"地址"
    });
});

router.get('/sf', function(req, res, next) {
    var current=Number(req.query.p);
    var total = 100;
    getTable('/sf', current, total, 'T_WATER_NRESIDENT', res, req, {
        MONTH:"抄表月份",
        FN:"档案号",
        NAME:"客户名称",
        CONSUMPTION:"本月用水量",
        INDUSTRY:"行业"
    });
});

router.get('/sp', function(req, res, next) {
    var current=Number(req.query.p);
    var total = 100;
    getTable('/sp', current, total, 'V_LZCITY_APPROVE_CONTROL_INFO', res, req, {
        CUST_NAME:"申请人",
        BEGIN_DATE:"开始时间",
        ACCEPT_DATE:"受理时间",
        APPROVE_ITEM:"流水号",
        APPROVE_ITEM_NAME:"事项名",
        APPROVE_STATUS:"事项状态代码"
    });
});

router.get('/gs', function(req,res,next) {
    var current=Number(req.query.p);
    var total = 100;
    getTable('/gs', current, total, 'SSDJ_JBXX', res, req, {
        MC:"公司名称",
        FDDBR:"法人",
        ZYXMLB:"主营项目类别",
        JYFW:"经营范围",
        DZ:"地址",
        QYLX:"企业类型"
    });
});

module.exports = router;