var express = require('express');
var router = express.Router();
var mysqlDao = require("../modal/dao/mysqlDao.js");


function getTable(tableUrl, current, total, tableName, res, tableNames) {
	mysqlDao.queryAll(tableName, function(err, results) {
        if (!err) {
            res.render('table', {
                    title: '总览',
                    table: results,
                    tableNames:tableNames,
                    current:current,
                    total:total,
                    tableUrl:tableUrl
                });
        }
    });
}
router.get('/ldjg', function(req, res, next) {
    var current=Number(req.query.p);
    var total = 100;
    getTable('/ldjg', current, total, 'LDZF_CASE', res, {
        ORG_CODE:"所属中队",
        CASE_TYPE:"基本情况-案件类型（案由）",
        CASE_AMT:"基本情况-涉案金额",
        UNIT_QY_NAME:"单位-单位名称或个人名称",
        JT_LINK:"举报/投诉-联系电话",
        JT_REQUEST:"举报/投诉-要求摘要"
    });
});

router.get('/aqjg', function(req, res, next) {
    var current=Number(req.query.p);
    var total = 100;
    getTable('/aqjg', current, total, 'LGSAFE_CASE', res,{
        CREATOR:"创建者",
        MAIN_PERSON:"主要人物",
        CASE_NAME:"案件名",
        MEMBER_TEL:"成员电话",
        CASE_SITUATION:"案件状况",
        LEGAL_NAME:"法人名字"
    });
});

router.get('/hbjg', function(req, res, next) {
    getTable('T_YYYD_LA_MAIN', res, {
        UNDERTAKEMAN:"承办人",
        STARTTIME:"立案时间",
        PARTY:"当事人",
        UNDERTAKEDEPART:"承办部门",
        CASEINTRODU:"案件介绍",
        PUNISHADVICE:"处罚建议"
    });
});

router.get('/syjg', function(req, res, next) {
    getTable('B_CY_RC_J_XCJC', res, {
        JCQYMC:"公司名称",
        JCDD:"公司地址",
        DH:"电话"
    });
});

router.get('/df', function(req, res, next) {
    getTable('T_ELECTRICITY', res, {
        MONTH:"抄表月份",
        UNIT:"单位",
        CODE:"工代号",
        NAME:"户名",
        ADDRESS:"地址"
    });
});

router.get('/sf', function(req, res, next) {
    getTable('T_WATER_NRESIDENT', res, {
        MONTH:"抄表月份",
        FN:"档案号",
        NAME:"客户名称",
        CONSUMPTION:"本月用水量",
        INDUSTRY:"行业"
    });
});

router.get('/sp', function(req, res, next) {
    getTable('V_LZCITY_APPROVE_CONTROL_INFO', res, {
        BEGIN_DATE:"开始时间",
        ACCEPT_DATE:"受理时间",
        APPROVE_ITEM:"流水号",
        APPROVE_ITEM_NAME:"事项名",
        APPROVE_STATUS:"事项状态代码"
    });
});

module.exports = router;