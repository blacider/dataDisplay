var express = require('express');
var router = express.Router();

var oracleDao = require('../modal/oracleDao/oracleDao.js');

router.get('/oracle', function(req, res, next) {
    oracleDao.query("SELECT * FROM lgsafe.case", function(result) {
        res.json(JSON.stringify(result));
    });
});

module.exports = router;