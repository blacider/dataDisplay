var express = require('express');
var router = express.Router();
var mysqlDao = require("../modal/dao/mysqlDao.js");
var dataDao = require("../modal/dao/dataDao.js");


router.get('/enterprise', function(req, res, next) {
	dataDao.queryAllByConName('湘军',function(err,results) {
		console.log(results);
		res.json(results);
	});
});

module.exports = router;