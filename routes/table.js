var express = require('express');
var router = express.Router();
var mysqlDao = require("../modal/dao/mysqlDao.js");


function getTable(tableName, res) {
	mysqlDao.queryAll(tableName, function(err, results) {
        if (!err) {
            console.log(err);
            res.json(results);
        }
    });
}
router.get('/ldjg', function(req, res, next) {
    getTable('LDZF_CASE', res);
});

router.get('/aqjg', function(req, res, next) {
    getTable('LGSAFE_CASE', res);
});

router.get('/hbjg', function(req, res, next) {
    getTable('T_YYYD_LA_MAIN', res);
});

router.get('/syjg', function(req, res, next) {
    getTable('B_CY_RC_J_XCJC', res);
});