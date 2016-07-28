var express = require('express');
var router = express.Router();

var oracleDao = require('../modal/oracleDao/oracleDao.js');

router.get('/oracle', function(req, res, next) {
    oracleDao.query("select count(*) from exdb.ssdj_jbxx", function(result) {
        res.json(JSON.stringify(result));
    });
});
router.get('/getComData', function(req, res, next) {
    // [1,10]
    var p = 1, tableNames = {
        ZCH: '统一社会信用代码<br>（组织结构代码）',
        MC: '企业名称',
        DZ: '地址',
        ZTZT: '经营状态'
    };
    if (req.query.p) p = Number(req.query.p);
    var end = p*10;
    oracleDao.query("SELECT ZCH, MC, DZ, ZTZT FROM (SELECT A.*, ROWNUM RN FROM (SELECT * FROM exdb.ssdj_jbxx) A WHERE ROWNUM <= " + end + ") WHERE RN >= " + (end-10),
    function(result) {
        var table = result["rows"];
        var tableData = [], tmp = {}, j;
        for (var i = 0; i <= 9; i++) {
            j = 0;
            tmp = {};
            for (item in tableNames) {
                tmp[item] = table[i][j];
                j++;
            }
            tableData.push(tmp);
        }
        res.json({
            table:tableData
        });
    });
});

router.get('/getComDataByAttr', function(req, res, next) {
    var n = req.query.n, v = req.query.v;
    oracleDao.query("SELECT ZCH,"+n+" FROM exdb.ssdj_jbxx where "+n+" like '%"+v+"%' and rownum <= 5",
    function(result) {
        res.json({
            data:result
        });
    });
});

router.get('/com', function(req, res, next) {
    var zch = req.query.ZCH;
    oracleDao.query("SELECT * FROM exdb.ssdj_jbxx where ZCH = '"+zch+"'", function(result) {
        res.render('com', {
            title: '总览',
            data:result["rows"][0]
        });
    });
});

router.get('/sf', function(req, res, next) {
    // [1,10]
    var p = 1;
    if (req.query.p) p = Number(req.query.p);
    var end = p*10;
    oracleDao.query("SELECT FN, NAME, MONTH, SHORT, CONSUMPTION, INDUSTRY FROM (SELECT A.*, ROWNUM RN FROM (SELECT * FROM WEBLH.T_WATER_NRESIDENT) A WHERE ROWNUM <= " + end + ") WHERE RN >= " + (end-10),
    function(result) {
        var table = result["rows"];
        var tableData = [], tmp = {};
        for (var i = 0; i <= 9; i++) {
            tmp = {};
            for (var j = 0; j < result["metaData"].length; j++) {
                if (result["metaData"][j]["name"] == "MONTH") {
                    tmp[result["metaData"][j]["name"]] = (table[i][j] != null)?table[i][j].toLocaleDateString():"";
                } else {
                    tmp[result["metaData"][j]["name"]] = (table[i][j] != null)?table[i][j]:"";
                }
            }
            tableData.push(tmp);
        }
        console.log(JSON.stringify(tableData));
        res.json({
            table:tableData
        });
    });
});

router.get('/jbxx', function(req, res, next) {
    oracleDao.query("select clrq, czsj from EXDB.EX_GONGSHANG_41V2_SSZTJCXX where zch = '"+req.query.zch+"'",
    function(result) {
        res.render('jbxx', {
            data:result["rows"]
        });
    });
});
router.get('/spxx', function(req, res, next) {
    oracleDao.query("select a.ORIGINAl_SEQ, start_date, unit_name, approve_item, complete_date from lg_base.V_SP_SHENQIN@TO_QYXX a, lg_base.V_SP_SHENPIFISH@TO_QYXX b where a.ORIGINAl_SEQ = b.ORIGINAl_SEQ and a.cust_name = '"+req.query.name+"'",
    function(result) {
        res.render('spxx', {
            data:result["rows"]
        });
    });
});

module.exports = router;