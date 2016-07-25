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
    oracleDao.query("SELECT ZCH, MC, DZ, ZTZT FROM (SELECT A.*, ROWNUM RN FROM (SELECT * FROM exdb.ssdj_jbxx order by ZCH) A WHERE ROWNUM <= " + end + ") WHERE RN >= " + (end-10),
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
module.exports = router;