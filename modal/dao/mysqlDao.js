// dao/caseDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var pool  = mysql.createPool($util.extend({}, $conf.mysql));


var queryAll = 'select * from ';

module.exports = {
    queryAll: function (tableName, callback) {
        pool.getConnection(function(err, connection) {
            connection.query(queryAll+tableName, function(err, result) {
                callback(err, result);
                connection.release();
            });
        });
    }
};