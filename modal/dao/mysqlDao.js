// dao/caseDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var logger = require("../../util/logger.js");

var pool  = mysql.createPool($util.extend({}, $conf.mysql));

var sql = {
    queryAll:"select * from ?",
    queryNum:"select count(*) from"
};


module.exports = {
    queryAll: function (tableName,current, callback) {
    	console.log(new Date(), current);
        pool.getConnection(function(err, connection) {
        	console.log(new Date(), current);
        	itemNum = (current-1)*10;
        	querySQL = "select * from " + tableName + " limit " + itemNum + ", 10";
            connection.query(querySQL, function(err, result) {
                callback(err, result);
                connection.release();
            });
        });
    },
    queryNum:function (tableName, callback) {
    	pool.getConnection(function(err, connection) {
    		querySQL = sql.queryNum+tableName;
    		connection.query(querySQL, function(err, result) {
    			callback(err, result);
                connection.release();
            });
    	});
    }
};