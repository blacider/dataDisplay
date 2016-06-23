// dao/dataDao.js
// 实现与Oracle交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var sql = {
  queryByNameInLDJG: 'select * from LDZF_CASE where UNIT_QY_NAME LIKE N\'%',

  queryByNameInAQJG: 'select * from LGSAFE_CASE where CASE_MEMBER LIKE N\'%',

  queryByNameInHBJG: 'select * from T_YYYD_LA_MAIN where UNDERTAKEMAN LIKE N\'%',

  queryByNameInSYJG: 'select * from B_CY_RC_J_XCJC where JCQYMC LIKE N\'%',
  
  queryByNameInDF: 'select * from T_ELECTRICITY where NAME LIKE N\'%',

  queryByNameInSF: 'select * from T_WATER_NRESIDENT where NAME LIKE N\'%',

  queryByNameInSP: 'select * from V_LZCITY_APPROVE_CONTROL_INFO where CUST_NAME LIKE N\'%'

};

var pool  = mysql.createPool($util.extend({}, $conf.mysql));

var eachPageItemCount = 10;
module.exports = {
    queryAllByConName: function(enterpriseName, callback) {
        var status = 0, max = 7, results = [];
            pool.getConnection(function(err, connection) {
              for(item in sql) {
                connection.query(sql[item]+enterpriseName+'%\'', function(err,result) {
                     console.log(sql[item]+enterpriseName+'%\'');
                    if (result) {
                      if(result.length != 0) {
                        results = results.concat(result);
                      }
                    }
                    if (status == max-1) {
                        status += 1;
                        callback(err, results);
                        connection.release();
                    } else {
                        status = status+1;
                    }
                });
              }
        });
    }
};